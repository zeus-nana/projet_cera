import Row from "../ui/Row.jsx";
import Heading from "../ui/Heading.jsx";
import ChargementDetailTable from "../features/chargement/ChargementDetailTable.jsx";

function ChargementDetail() {
  return (
    <>
      <Row type="horizontal">
        <Heading type="h1">Détails sur les erreurs</Heading>
      </Row>
      <Row>
        <ChargementDetailTable />
      </Row>
    </>
  );
}

export default ChargementDetail;
