import DateFilter from "../../ui/DateFilter.jsx";
import Row from "../../ui/Row.jsx";
import { useEffect, useState } from "react";
import Button from "../../ui/Button.jsx";

function ChargementFilter() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setStartDate(formattedToday);
    setEndDate(formattedToday);
  }, []);

  const handleFilter = () => {
    // Ici, vous feriez l'appel à votre API avec les dates sélectionnées
    console.log("Filtrer les données du", startDate, "au", endDate);
    // Exemple d'appel API (à adapter selon votre setup) :
    // fetchFilteredData(startDate, endDate);
  };

  return (
    <Row type="horizontal">
      <DateFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <Button size="small" onClick={handleFilter}>
        Afficher
      </Button>
    </Row>
  );
}

export default ChargementFilter;
