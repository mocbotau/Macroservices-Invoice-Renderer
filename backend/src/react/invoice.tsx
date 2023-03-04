import React from "react";
import ReactPDF, {
  Page,
  Text,
  View,
  Document,
} from "@react-pdf/renderer";

import { Party } from "./components/Party";
import { styles } from "./styles";
import { JSONValue } from "@src/interfaces";

const Invoice = (props: {ubl: JSONValue}) => {
  return (
    <Document>
      <Page size="A4" styles={styles.page}>
        <View style={styles.section}>
          <Party party={props.ubl["AccountingCustomerParty"]["Party"]} />
        </View>
      </Page>
    </Document>
  );
}

export default async function renderInvoiceToPDF(ubl: JSONValue) {
  return await ReactPDF.renderToStream(<Invoice ubl={ubl}/>);
}
