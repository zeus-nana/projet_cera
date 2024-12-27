import Table from "../../ui/Table";
import PropTypes from "prop-types";

function TransactionRow({ transaction }) {
  const {
    date_operation,
    etat,
    service,
    reference,
    sens,
    montant,
    frais_ht,
    tta,
    tva,
    frais_ttc,
    commission,
    statut_operation,
    expediteur,
    beneficiaire,
    guichet,
    agence,
    partenaire,
    categorie,
    sous_categorie,
    responsable,
    application,
    v_hv,
    region,
    departement,
    commune,
    code_agence,
    pole,
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
      <span name="date_operation" alignment="center">
        {formattedDate}
      </span>
      <span name="etat">{etat}</span>
      <span name="service">{service}</span>
      <span name="reference">{reference}</span>
      <span name="sens">{sens}</span>
      <span name="montant" alignment="right">
        {formatMontant(montant)}
      </span>
      <span name="frais_ht" alignment="right">
        {formatMontant(frais_ht)}
      </span>
      <span name="tta" alignment="right">
        {formatMontant(tta)}
      </span>
      <span name="tva" alignment="right">
        {formatMontant(tva)}
      </span>
      <span name="frais_ttc" alignment="right">
        {formatMontant(frais_ttc)}
      </span>
      <span name="commission" alignment="right">
        {formatMontant(commission)}
      </span>
      <span name="statut_operation">{statut_operation}</span>
      <span name="expediteur">{expediteur}</span>
      <span name="beneficiaire">{beneficiaire}</span>
      <span name="guichet">{guichet}</span>
      <span name="agence">{agence}</span>
      <span name="partenaire">{partenaire}</span>
      <span name="categorie">{categorie}</span>
      <span name="sous_categorie">{sous_categorie}</span>
      <span name="responsable">{responsable}</span>
      <span name="application">{application}</span>
      <span name="v_hv">{v_hv}</span>
      <span name="region">{region}</span>
      <span name="departement">{departement}</span>
      <span name="commune">{commune}</span>
      <span name="code_agence">{code_agence}</span>
      <span name="pole">{pole}</span>
    </Table.Row>
  );
}

TransactionRow.propTypes = {
  transaction: PropTypes.shape({
    date_operation: PropTypes.string,
    etat: PropTypes.string,
    service: PropTypes.string,
    reference: PropTypes.string,
    sens: PropTypes.string,
    montant: PropTypes.string,
    frais_ht: PropTypes.string,
    tta: PropTypes.string,
    tva: PropTypes.string,
    frais_ttc: PropTypes.string,
    commission: PropTypes.string,
    statut_operation: PropTypes.string,
    expediteur: PropTypes.string,
    beneficiaire: PropTypes.string,
    guichet: PropTypes.string,
    agence: PropTypes.string,
    partenaire: PropTypes.string,
    categorie: PropTypes.string,
    sous_categorie: PropTypes.string,
    responsable: PropTypes.string,
    application: PropTypes.string,
    v_hv: PropTypes.string,
    region: PropTypes.string,
    departement: PropTypes.string,
    commune: PropTypes.string,
    code_agence: PropTypes.string,
    pole: PropTypes.string,
  }).isRequired,
};

export default TransactionRow;
