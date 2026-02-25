const rawBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:5000/api/v1";

export const BASE_URL = rawBaseUrl.replace(/\/$/, "");

export const COMMISSION_RATE = 0.15;

export const DASHBOARD_PAGE_SIZE = 10;
