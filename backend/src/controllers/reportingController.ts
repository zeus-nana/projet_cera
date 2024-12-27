import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import db from '../database/connection';
import { Transaction } from '../models/Transaction';
import AppError from '../utils/appError';

const getTransactionByDate = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return new AppError('Les dates de début et de fin sont requises', 400);
  }

  const transactions: Partial<Transaction>[] = await db<Transaction>(
    'transaction',
  )
    .select(
      'id',
      'etat',
      db.raw(`TO_CHAR(DATE(date_operation), 'YYYY-MM-DD') AS date_operation`),
      'service',
      'reference',
      db.raw(
        `CASE WHEN sens = 'e' THEN 'Entrée' WHEN sens = 's' THEN 'Sortie' END AS sens`,
      ),
      'montant',
      'frais_ht',
      'tta',
      'tva',
      'frais_ttc',
      'commission',
      'statut_operation',
      'expediteur',
      'beneficiaire',
      'guichet',
      'agence',
      'partenaire',
      'categorie',
      'sous_categorie',
      'responsable',
      'application',
      'v_hv',
      'region',
      'departement',
      'commune',
      'code_agence',
      'pole',
    )
    .where(
      'date_operation',
      '>=',
      db.raw(`?::timestamp`, [`${startDate} 00:00:00`]),
    )
    .andWhere(
      'date_operation',
      '<=',
      db.raw(`?::timestamp`, [`${endDate} 23:59:59`]),
    );

  console.log(transactions.length);

  return res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions,
    },
  });
});

const getTransactionAgregeByDate = catchAsync(
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Les dates de début et de fin sont requises',
      });
    }

    console.log('date filtre : ', startDate, endDate);

    const aggregatedTransactions = await db('vw_transaction_agrege')
      .select('*')
      .where('date_operation', '>=', startDate as string)
      .andWhere('date_operation', '<=', endDate as string);

    console.log("nombre d'operation : ", aggregatedTransactions.length);

    return res.status(200).json({
      status: 'success',
      results: aggregatedTransactions.length,
      data: {
        aggregatedTransactions,
      },
    });
  },
);

const getErrorChargementById = catchAsync(
  async (req: Request, res: Response) => {
    const { chargement_id } = req.query;

    const chargeError = await db('erreur_chargement_log')
      .select('*')
      .where({ chargement_id });

    return res.status(200).json({
      status: 'success',
      results: chargeError.length,
      data: {
        chargeError,
      },
    });
  },
);

const getChargementByDate = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      status: 'error',
      message: 'Les dates de début et de fin sont requises',
    });
  }

  const chargements = await db('chargement')
    .select(
      'chargement.id',
      'users.login as charge_par',
      'chargement.etat',
      'chargement.type',
      'chargement.nombre_succes',
      'chargement.nombre_echec',
      'chargement.chemin_fichier',
      db.raw(
        `CASE WHEN statut = 'e' THEN 'en_cours' WHEN statut = 't' THEN 'termine' END AS statut`,
      ),
      db.raw('DATE(chargement.created_at) as date_chargement'),
    )
    .join('users', 'chargement.created_by', '=', 'users.id')
    .where(db.raw('DATE(chargement.created_at)'), '>=', startDate as string)
    .andWhere(db.raw('DATE(chargement.created_at)'), '<=', endDate as string)
    .orderBy('chargement.id', 'desc');

  console.log(chargements.length);
  return res.status(200).json({
    status: 'success',
    results: chargements.length,
    data: {
      chargements,
    },
  });
});

const getDashboardData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return next(
        new AppError('Les dates de début et de fin sont requises', 400),
      );
    }

    const createStartDate = (dateString: string) =>
      new Date(`${dateString}T00:00:00.000Z`);
    const createEndDate = (dateString: string) =>
      new Date(`${dateString}T23:59:59.999Z`);

    const startDateObj = createStartDate(startDate as string);
    const endDateObj = createEndDate(endDate as string);
    const duration = endDateObj.getTime() - startDateObj.getTime();

    const previousEndDate = new Date(startDateObj.getTime() - 1);
    const previousStartDate = new Date(previousEndDate.getTime() - duration);

    const generateDateSeries = (start: Date, end: Date): string[] => {
      const dates: string[] = [];
      let currentDate = new Date(start);
      while (currentDate <= end) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    const currentDateSeries = generateDateSeries(startDateObj, endDateObj);
    const previousDateSeries = generateDateSeries(
      previousStartDate,
      previousEndDate,
    );

    const [commissionTotal] = await db('transaction')
      .select([
        db.raw(
          'SUM(CASE WHEN date_operation >= ? AND date_operation <= ? THEN COALESCE(commission, 0) ELSE 0 END) as periode_courante',
          [startDateObj.toISOString(), endDateObj.toISOString()],
        ),
        db.raw(
          'SUM(CASE WHEN date_operation >= ? AND date_operation <= ? THEN COALESCE(commission, 0) ELSE 0 END) as periode_precedente',
          [previousStartDate.toISOString(), previousEndDate.toISOString()],
        ),
      ])
      .where(function () {
        this.where('statut_operation', '<>', 'Annulé').orWhereNull(
          'statut_operation',
        );
      });

    interface Commission {
      date: string;
      commission: string;
    }

    const getCommissionParJour = async (
      startDate: Date,
      endDate: Date,
      dateSeries: string[],
    ): Promise<Commission[]> => {
      const commissions: Commission[] = await db('transaction')
        .select([
          db.raw(
            "TO_CHAR(DATE(date_operation AT TIME ZONE 'UTC'), 'YYYY-MM-DD') as date",
          ),
          db.raw('SUM(COALESCE(commission, 0)) as commission'),
        ])
        .whereBetween('date_operation', [
          startDate.toISOString(),
          endDate.toISOString(),
        ])
        .whereNotNull('commission')
        .where(function () {
          this.where('statut_operation', '<>', 'Annulé').orWhereNull(
            'statut_operation',
          );
        })
        .groupBy(db.raw("DATE(date_operation AT TIME ZONE 'UTC')"))
        .orderBy('date');

      const commissionsMap: Record<string, Commission> = dateSeries.reduce(
        (acc, date) => {
          acc[date] = { date, commission: '0' };
          return acc;
        },
        {} as Record<string, Commission>,
      );

      commissions.forEach(({ date, commission }) => {
        commissionsMap[date] = { date, commission: commission.toString() };
      });
      return Object.values(commissionsMap);
    };

    const commission_par_jour = await getCommissionParJour(
      startDateObj,
      endDateObj,
      currentDateSeries,
    );

    interface TopItem {
      name: string;
      commission: string;
    }

    const getTop10Items = async (
      startDate: Date,
      endDate: Date,
      groupByField: string,
    ): Promise<TopItem[]> => {
      return db('transaction')
        .select([
          `${groupByField} as name`,
          db.raw('SUM(commission) as commission'),
        ])
        .whereBetween('date_operation', [
          startDate.toISOString(),
          endDate.toISOString(),
        ])
        .whereNotNull('commission')
        .whereNot('commission', 0)
        .where(function () {
          this.where('statut_operation', '<>', 'Annulé').orWhereNull(
            'statut_operation',
          );
        })
        .groupBy(groupByField)
        .orderBy('commission', 'desc');
    };

    const top_10_partenaires = await getTop10Items(
      startDateObj,
      endDateObj,
      'partenaire',
    );

    const top_10_services = await getTop10Items(
      startDateObj,
      endDateObj,
      'service',
    );

    // Nouvelle fonction pour obtenir les commissions par catégorie
    const getCommissionParCategorie = async (
      startDate: Date,
      endDate: Date,
    ): Promise<TopItem[]> => {
      return db('transaction')
        .select(['categorie as name', db.raw('SUM(commission) as commission')])
        .whereBetween('date_operation', [
          startDate.toISOString(),
          endDate.toISOString(),
        ])
        .whereNotNull('commission')
        .whereNot('commission', 0)
        .where(function () {
          this.where('statut_operation', '<>', 'Annulé').orWhereNull(
            'statut_operation',
          );
        })
        .groupBy('categorie')
        .orderBy('commission', 'desc');
    };

    const commissions_par_categorie = await getCommissionParCategorie(
      startDateObj,
      endDateObj,
    );

    return res.status(200).json({
      status: 'success',
      data: {
        commission_total: {
          periode_courante: commissionTotal.periode_courante,
          periode_precedente: commissionTotal.periode_precedente,
        },
        commission_par_jour,
        top_10_partenaires,
        top_10_services,
        commissions_par_categorie, // Nouvelle section ajoutée
      },
    });
  },
);

export default {
  getTransactionByDate,
  getTransactionAgregeByDate,
  getErrorChargementById,
  getChargementByDate,
  getDashboardData,
};

// const commissionParJourPrecedent = await getCommissionParJour(
//   previousStartDate,
//   previousEndDate,
//   previousDateSeries,
// );
