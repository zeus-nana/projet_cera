import Table from "../../ui/Table";
import PropTypes from "prop-types";

function TransactionRow({transaction}) {
    const {
        categorie,
        sous_categorie,
        statut_operation,
        responsable,
        partenaire,
        application,
        date_operation,
        service,
        montant,
        frais_ttc,
        frais_ht,
        tva,
        commission,
        nombre_operation,
        code_agence,
        agence,
        v_hv,
        region,
        departement,
        commune,
    } = transaction;

    // Formater la date en dd/mm/aaaa
    const formattedDate = new Date(date_operation).toLocaleDateString("fr-FR");

    // Fonction pour formater les montants avec deux décimales et enlever les zéros inutiles
    const formatMontant = (value) =>
        Number(value).toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    /* eslint-disable react/no-unknown-property */

    return (
        <Table.Row>
            <span name="categorie">{categorie}</span>
            <span name="sous_categorie">{sous_categorie}</span>
            <span name="responsable">{responsable}</span>
            <span name="partenaire">{partenaire}</span>
            <span name="application">{application}</span>
            <span name="date_operation" alignment="center">
        {formattedDate}
      </span>
            <span name="service">{service}</span>

            <span name="montant" alignment="right">
        {formatMontant(montant)}
      </span>
            <span name="frais_ttc" alignment="right">
        {formatMontant(frais_ttc)}
      </span>
            <span name="frais_ht" alignment="right">
        {formatMontant(frais_ht)}
      </span>
            <span name="tva" alignment="right">
        {formatMontant(tva)}
      </span>
            <span name="commission" alignment="right">
        {formatMontant(commission)}
      </span>
            <span name="nombre_operation" alignment="right">
        {nombre_operation}
      </span>
            <span name="code_agence" alignment="center">
        {code_agence}
      </span>
            <span name="agence">{agence}</span>
            <span name="v_hv" alignment="center">
        {v_hv}
      </span>
            <span name="region" alignment="center">
        {region}
      </span>
            <span name="departement" alignment="center">
        {departement}
      </span>
            <span name="commune" alignment="center">
        {commune}
      </span>
            <span name="statut_operation" alignment="center">
        {statut_operation}
      </span>
        </Table.Row>
    );
}

TransactionRow.propTypes = {
    transaction: PropTypes.shape({
        categorie: PropTypes.string,
        sous_categorie: PropTypes.string,
        statut_operation: PropTypes.string,
        responsable: PropTypes.string,
        partenaire: PropTypes.string,
        application: PropTypes.string,
        date_operation: PropTypes.string,
        service: PropTypes.string,
        montant: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        frais_ttc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        frais_ht: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        tva: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        commission: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        nombre_operation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        code_agence: PropTypes.string,
        agence: PropTypes.string,
        v_hv: PropTypes.string,
        region: PropTypes.string,
        departement: PropTypes.string,
        commune: PropTypes.string,
    }).isRequired,
};

export default TransactionRow;
