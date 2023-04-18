import React, { useEffect, useState } from "react";
import ExportOptions from "@src/components/ExportOptions/ExportOptions";
import { CssBaseline } from "@mui/material";
import CSVConfiguration from "@src/components/CSVConfiguration/CSVConfiguration";
import { NextSeo } from "next-seo";
import { loadFile, loadUBL, saveUBL } from "@src/persistence";
import { useRouter } from "next/router";
import { Emails, PhoneNumbers, SessionWithSub } from "@src/interfaces";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { DBAll } from "@src/utils/DBHandler";

export interface ServerSideProps {
  emails: Emails[];
  phones: PhoneNumbers[];
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session: SessionWithSub = await getSession(context);

  let emails: Emails[] = (await DBAll(
    "SELECT ID AS id, Name AS name, EmailAddress AS email FROM ContactDetails WHERE Account = ?",
    [session?.user?.email || session?.user?.sub]
  )) as Emails[];

  let phones: PhoneNumbers[] = (await DBAll(
    "SELECT ID AS id, Name AS name, PhoneNumber AS phone FROM ContactDetails WHERE Account = ?",
    [session?.user?.email || session?.user?.sub]
  )) as PhoneNumbers[];

  emails = emails.filter((email) => email.email.length !== 0);
  phones = phones.filter((phone) => phone.phone.length !== 0);

  return {
    props: { emails, phones }, // will be passed to the page component as props
  };
}

export const ContactsContext = React.createContext<ServerSideProps | null>(
  null
);

export default function Editor(props: ServerSideProps) {
  const router = useRouter();

  const id = parseInt(router.query.id as string);

  const [file, setFile] = useState<File>();
  const [loadedXML, setLoadedXML] = useState("");

  const loadCSV = () => {
    const f = loadFile(id);

    if (f !== null) {
      setFile(f);
      return true;
    }
    return false;
  };

  const loadXMLData = () => {
    const ubl = loadUBL(id);

    if (ubl !== null) {
      setLoadedXML(ubl);
      return true;
    }
    return false;
  };

  useEffect(() => {
    const hasCSV = loadCSV();
    const hasXML = loadXMLData();
    if (!hasCSV && !hasXML) {
      router.push("/dashboard");
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <NextSeo title="Editor" />
      <CssBaseline />

      {loadedXML ? (
        <ContactsContext.Provider value={props}>
          <ExportOptions ubl={loadedXML} />
        </ContactsContext.Provider>
      ) : (
        file && (
          <CSVConfiguration
            id={id}
            file={file}
            setLoadedXML={(loadedXML) => {
              setLoadedXML(loadedXML);
              saveUBL(loadedXML, id);
            }}
          ></CSVConfiguration>
        )
      )}
    </>
  );
}
