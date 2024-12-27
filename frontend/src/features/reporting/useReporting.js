/*eslint-disable no-undef*/
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const STORAGE_KEY_PREFIX = "reportingDateRange_";

export function useReporting(queryKey, fetchFunction, reportType) {
  const storageKey = `${STORAGE_KEY_PREFIX}${reportType}`;

  const [dateRange, setDateRange] = useState(() => {
    const savedDateRange = localStorage.getItem(storageKey);
    if (savedDateRange) {
      return JSON.parse(savedDateRange);
    }
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    return {
      startDate: formattedToday,
      endDate: formattedToday,
    };
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(dateRange));
  }, [dateRange, storageKey]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKey, dateRange],
    queryFn: () => fetchFunction(dateRange.startDate, dateRange.endDate),
    enabled: !!dateRange.startDate && !!dateRange.endDate,
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      refetch();
    }
  }, [dateRange, refetch]);

  const handleFilter = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  return { data, isLoading, error, dateRange, handleFilter };
}
