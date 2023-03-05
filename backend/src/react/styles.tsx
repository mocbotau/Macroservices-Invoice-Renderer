import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    margin: 10,
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    fontFamily: "Helvetica",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    fontSize: 15,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
});
