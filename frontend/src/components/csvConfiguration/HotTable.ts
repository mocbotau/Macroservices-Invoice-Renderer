import dynamic from "next/dynamic";

export const HotTable = dynamic(
  () =>
    import("@handsontable/react").then((mod) => {
      return mod;
    }),
  { ssr: false }
);
