export type LeadDateRange = {
  dateFrom: string;
  dateTo: string;
};

export const LEAD_MONTH_DEFAULT_START = "2026-06-30";

export function resolveLeadMonthRange(dataFrom: string, dataTo: string): LeadDateRange {
  const monthStart = `${dataTo.slice(0, 7)}-01`;
  const configuredStart = LEAD_MONTH_DEFAULT_START <= dataTo
    ? LEAD_MONTH_DEFAULT_START
    : monthStart;
  return {
    dateFrom: configuredStart < dataFrom ? dataFrom : configuredStart,
    dateTo: dataTo,
  };
}

export function isValidLeadDateRange(
  dateFrom: string,
  dateTo: string,
  dataFrom?: string,
  dataTo?: string,
): boolean {
  if (!dateFrom || !dateTo || dateFrom > dateTo) return false;
  if (dataFrom && dateFrom < dataFrom) return false;
  if (dataTo && dateTo > dataTo) return false;
  return true;
}
