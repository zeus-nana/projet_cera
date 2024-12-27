import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ReportingService from "../../services/reportingService.js";

const STORAGE_KEY_PREFIX = "dashboardDateRange";

export function useDashboardData() {
  const storageKey = `${STORAGE_KEY_PREFIX}`;

  const [dateRange, setDateRange] = useState(() => {
    const savedDateRange = localStorage.getItem(storageKey);
    if (savedDateRange) {
      return JSON.parse(savedDateRange);
    }
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const sevenDaysAgo = new Date(yesterday);
    sevenDaysAgo.setDate(yesterday.getDate() - 6);
    return {
      startDate: sevenDaysAgo.toISOString().split("T")[0],
      endDate: yesterday.toISOString().split("T")[0],
    };
  });

  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(dateRange));
  }, [dateRange, storageKey]);

  const { data, isLoading, error} = useQuery({
    queryKey: ["dashboardData", dateRange],
    queryFn: () =>
      ReportingService.getDashboardData(dateRange.startDate, dateRange.endDate),
    enabled: shouldFetch && !!dateRange.startDate && !!dateRange.endDate,
    staleTime: 30 * 60 * 1000,
  });

  const handleFilter = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
    setShouldFetch(true);
  };

  const fetchData = () => {
    setShouldFetch(true);
  };

  return { data, isLoading, error, dateRange, handleFilter, fetchData };
}
