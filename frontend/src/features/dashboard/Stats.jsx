import PropTypes from "prop-types";
import Stat from "./Stat.jsx";
import {
  HiArrowTrendingUp,
  HiArrowTrendingDown,
  HiOutlineBanknotes,
} from "react-icons/hi2";
import { formatNumber } from "../../helper.js";

function calculatePercentageChange(current, previous) {
  const currentNum = Number(current);
  const previousNum = Number(previous);
  if (previousNum === 0) return currentNum > 0 ? 100 : 0;
  return ((currentNum - previousNum) / previousNum) * 100;
}

function Stats({ commission_total }) {
  const percentageChange = calculatePercentageChange(
    commission_total.periode_courante,
    commission_total.periode_precedente,
  );

  const percentageColor = percentageChange >= 0 ? "green" : "red";
  const TrendIcon =
    percentageChange >= 0 ? HiArrowTrendingUp : HiArrowTrendingDown;

  return (
    <>
      <Stat
        icon={<HiOutlineBanknotes />}
        title="Commission Totale"
        value={formatNumber(commission_total.periode_courante).toString()}
        color="green"
      />
      <Stat
        icon={<HiOutlineBanknotes />}
        title="Précédent"
        value={formatNumber(commission_total.periode_precedente).toString()}
        color="blue"
      />
      <Stat
        icon={<TrendIcon />}
        title="Variation"
        value={`${formatNumber(Math.abs(percentageChange))}\u00A0%`}
        color={percentageColor}
      />
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </>
  );
}

// Validation des props
Stats.propTypes = {
  commission_total: PropTypes.shape({
    periode_courante: PropTypes.oneOfType([PropTypes.string, PropTypes.string])
      .isRequired,
    periode_precedente: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.string,
    ]).isRequired,
  }),
};

export default Stats;
