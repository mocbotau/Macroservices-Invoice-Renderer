/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';

import { Party } from "@src/react/components/Party"
import { Document, Page, Text } from "@react-pdf/renderer";

describe("Party component", () => {
  const testParty = {
    PartyIdentification: {
      _text: "80647710156",
      $schemeId: "0151",
      $schemeAgencyID: "ZZZ"
    },
    PartyName: {
      Name: "Ebusiness Software Services Pty Ltd"
    },
    PostalAddress: {
      StreetName: "100 Business St",
      CityName: "Dulwich Hill",
      PostalZone: "2203",
      Country: {
        IdentificationCode: {
          _text: "AU",
          $listAgencyID: "6", 
          $listID: "ISO3166-1:Alpha2"
        }
      },
      PartyLegalEntity: {
        RegistrationName: "Ebusiness Software Services Pty Ltd",
        CompanyID: {
          _text: "80647710156",
          $schemeAgencyID: "ZZZ",
          $schemeID: "0151"
        } 
      }
    }
  }

  test("It should contain a text field ", () => {
    render(
      <Document>
        <Page>
          <Text>Something</Text>
        </Page>
      </Document>
    );
    
    console.log(screen.getByText("Something"))
  });
});