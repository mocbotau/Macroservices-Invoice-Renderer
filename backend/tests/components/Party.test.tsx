/**
 * @jest-environment jsdom
 */

import "./jest-setup";

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Party } from "@src/react/components/Party";

describe("Party component", () => {
  const testParty = {
    PartyIdentification: {
      _text: "80647710156",
      $schemeId: "0151",
      $schemeAgencyID: "ZZZ",
    },
    PartyName: {
      Name: "Ebusiness Software Services Pty Ltd",
    },
    PostalAddress: {
      StreetName: "100 Business St",
      CityName: "Dulwich Hill",
      PostalZone: "2203",
      Country: {
        IdentificationCode: {
          _text: "AU",
          $listAgencyID: "6",
          $listID: "ISO3166-1:Alpha2",
        },
      },
      PartyLegalEntity: {
        RegistrationName: "Ebusiness Software Services Pty Ltd",
        CompanyID: {
          _text: "80647710156",
          $schemeAgencyID: "ZZZ",
          $schemeID: "0151",
        },
      },
    },
  };

  test("It should contain a text field ", () => {
    render(<Party party={testParty} />);

    expect(
      screen.getByText("Ebusiness Software Services Pty Ltd")
    ).toBeTruthy();
  });
});
