/* eslint-disable react/no-unknown-property */
import Table from "../../ui/Table";
import PropTypes from "prop-types";
import Menus from "../../ui/Menus";
import { HiEye } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDownloadFile } from "./useDownloadFile.js";
import { HiOutlineDownload } from "react-icons/hi";
import Tag from "../../ui/Tag.jsx";

function ChargementRow({ chargement }) {
  const navigate = useNavigate();
  const { downloadFile, isDownloading } = useDownloadFile();

  const {
    id,
    charge_par,
    etat,
    nombre_succes,
    nombre_echec,
    statut,
    date_chargement,
    chemin_fichier,
  } = chargement;

  const statusToTagName = {
    termine: "green",
    en_cours: "blue",
  };

  // Formater la date en dd/mm/aaaa
  const formattedDate = new Date(date_chargement).toLocaleDateString("fr-FR");

  const handleDetailsClick = () => {
    navigate(`/chargement/${id}`);
  };

  const handleDownloadClick = () => {
    if (chemin_fichier) {
      downloadFile(chemin_fichier);
    } else {
      toast.error("Chemin du fichier non disponible");
    }
  };

  return (
    <Table.Row>
      <span name="charge_par" alignment="center">
        {charge_par}
      </span>
      <span name="etat">{etat}</span>
      <span name="nombre_succes" alignment="right">
        {nombre_succes}
      </span>
      <span name="nombre_echec" alignment="right">
        {nombre_echec}
      </span>

      <span name="statut" alignment="center">
        <Tag type={statusToTagName[statut]}>{statut.replace("_", " ")}</Tag>
      </span>

      <span name="date_chargement" alignment="center">
        {formattedDate}
      </span>
      <span name="actions" alignment="center">
        <Menus.Menu>
          <Menus.Toggle id={id.toString()} />
          <Menus.List id={id.toString()}>
            <Menus.Button
              icon={<HiEye />}
              onClick={handleDetailsClick}
              disabled={nombre_echec === 0}
            >
              Détails sur les erreurs
            </Menus.Button>
            <Menus.Button
              icon={<HiOutlineDownload />}
              onClick={handleDownloadClick}
              disabled={isDownloading}
            >
              {isDownloading ? "Téléchargement..." : "Télécharger le fichier"}
            </Menus.Button>
          </Menus.List>
        </Menus.Menu>
      </span>
    </Table.Row>
  );
}

ChargementRow.propTypes = {
  chargement: PropTypes.shape({
    id: PropTypes.number.isRequired,
    charge_par: PropTypes.string,
    etat: PropTypes.string,
    nombre_succes: PropTypes.number,
    nombre_echec: PropTypes.number,
    statut: PropTypes.string,
    date_chargement: PropTypes.string,
    chemin_fichier: PropTypes.string,
  }).isRequired,
};

export default ChargementRow;
