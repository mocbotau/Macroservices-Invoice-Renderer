import React, { useEffect, useState } from "react";
import ExportOptions from "@src/components/ExportOptions/ExportOptions";
import { Box, CssBaseline, IconButton, Tooltip } from "@mui/material";
import CSVConfiguration from "@src/components/CSVConfiguration/CSVConfiguration";
import { NextSeo } from "next-seo";
import { loadFile, loadUBL, saveUBL } from "@src/persistence";
import { useRouter } from "next/router";
import { Emails, PhoneNumbers, SessionWithSub } from "@src/interfaces";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { DBAll } from "@src/utils/DBHandler";
import { ArrowBack } from "@mui/icons-material";
import useWindowDimensions from "@src/utils/useWindowDimensions";

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

  const { width } = useWindowDimensions();

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

  const goBack = () => {
    if (loadedXML && !file) {
      router.push("/dashboard");
    } else if (loadedXML && file) {
      setLoadedXML("");
      saveUBL(undefined, id);
    } else if (file) {
      router.push("/dashboard");
    }
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

      <Box position="fixed" ml={1} mt={1} display="block" zIndex={999}>
        <Tooltip
          title={`Back to ${file && loadedXML ? "CSV Config" : "Dashboard"}`}
        >
          <IconButton
            sx={{
              top: `${
                width <= 600 ? "-56px" : width <= 900 ? "-60px" : "-62px"
              }`,
              left: "-5px",
            }}
            onClick={goBack}
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
      </Box>

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
