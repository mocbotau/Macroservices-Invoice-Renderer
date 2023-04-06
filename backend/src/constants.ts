export const ABN_ID = "0151";

export const STYLES = [
  "Default (blue theme)",
  "Landscape",
  "Landscape (detailed)",
  "Summary",
  "Default (high contrast)",
];
export const SUPPORTED_LANGUAGES = [
  { langCode: "en", language: "English" },
  { langCode: "ar", language: "Arabic" },
  { langCode: "zh", language: "Chinese" },
  { langCode: "fr", language: "French" },
  { langCode: "de", language: "German" },
  { langCode: "hi", language: "Hindi" },
  { langCode: "it", language: "Italian" },
  { langCode: "ja", language: "Japanese" },
  { langCode: "ko", language: "Korean" },
  { langCode: "ru", language: "Russian" },
  { langCode: "es", language: "Spanish" },
  { langCode: "th", language: "Thai" },
];

export const DEFAULT_HEIGHT = 16;

export const PAGE_SIZES: {
  [page: string]: {
    WIDTH: number;
    HEIGHT: number;
    MARGIN: number;
    INNER_WIDTH?: number;
  };
} = {
  A4P: {
    WIDTH: 8.27 * 72, // A4 = 8.97 in x 11.69 in @ 72 dpi
    HEIGHT: 11.69 * 72,
    MARGIN: 24,
  },
  A4L: {
    WIDTH: 11.69 * 72,
    HEIGHT: 8.27 * 72,
    MARGIN: 24,
  },
};
Object.keys(PAGE_SIZES).forEach(
  (x) =>
    (PAGE_SIZES[x].INNER_WIDTH = PAGE_SIZES[x].WIDTH - 2 * PAGE_SIZES[x].MARGIN)
);

export const REQUIRED_FIELDS = [
  "AccountingSupplierParty",
  "AccountingCustomerParty",
  "InvoiceLine",
  "ID",
  "IssueDate",
  "TaxTotal",
  "LegalMonetaryTotal",
];
