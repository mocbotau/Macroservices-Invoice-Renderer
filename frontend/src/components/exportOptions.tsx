import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import ExportOptionsPanel from "./exportOptionsPanel";
import { useEffect, useState } from "react";
import { Api } from "@src/Api";
import { JsonViewer } from "@textea/json-viewer";
import { toBase64 } from "@src/utils";
import XMLViewer from "react-xml-viewer-2";
import useWindowDimensions from "@src/utils/useWindowDimensions";
import { MOBILE_WIDTH } from "@src/constants";

const lightXMLTheme = {
  "attributeKeyColor": "#3492d5",
  "attributeValueColor": "#d57045",
  "cdataColor": "#9699d4",
  "commentColor": "#c9c9c9",
  "separatorColor": "#83989d",
  "tagColor": "#83989d",
  "textColor": "#d57045",
  "overflowBreak": true,
};

const darkXMLTheme = {
  "attributeKeyColor": "#87975c",
  "attributeValueColor": "#d39053",
  "cdataColor": "#6b9792",
  "commentColor": "#8c8c8c",
  "separatorColor": "#c0c0c0",
  "tagColor": "#c0c0c0",
  "textColor": "#d39053",
  "overflowBreak": true,
};

export default function ExportOptions(props: { ubl: string }) {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const drawerWidth = theme.spacing(50);

  const [error, setError] = useState("");
  const [previewData, setPreviewData] = useState("");
  const [outputType, setOutputType] = useState("pdf");
  const [language, setLanguage] = useState("en");
  const [style, setStyle] = useState(0);
  const [iconFile, setIconFile] = useState<File>();
  const [loading, setLoading] = useState(true);
  const [previewHidden, setPreviewHidden] = useState(false);

  let optional = {};

  interface Response {
    status: number;
    blob: Blob;
  }

  const handleApiCall = (
    apiCall: Promise<Response>,
    // eslint-disable-next-line
    onSuccess: (blob: Blob) => void
  ) => {
    setLoading(true);
    setError("");

    apiCall
      .then((response: Response) => {
        if (response.status !== 200) {
          throw new Error("Something went wrong when generating the preview.");
        } else {
          return response.blob;
        }
      })
      .then(onSuccess)
      .catch((error: Error) => {
        setError(error.message);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const convertBase64 = async (file: File) => {
    if (iconFile) {
      optional["icon"] = await toBase64(file);
    } else {
      optional = {};
    }
  };

  useEffect(() => {
    setPreviewHidden(width <= MOBILE_WIDTH);
  }, [width]);

  useEffect(() => {
    const fetchData = async () => {
      switch (outputType) {
        case "pdf":
          await convertBase64(iconFile);
          handleApiCall(
            Api.renderToPDF(props.ubl, style, language, optional),
            (blob: Blob) => {
              const url = URL.createObjectURL(blob);
              setPreviewData(url);
            }
          );
          break;
        case "html":
          await convertBase64(iconFile);
          handleApiCall(
            Api.renderToHTML(props.ubl, style, language, optional),
            (blob: Blob) => {
              const url = URL.createObjectURL(blob);
              setPreviewData(url);
            }
          );
          break;
        case "json":
          handleApiCall(Api.renderToJSON(props.ubl), async (blob: Blob) => {
            const file = await blob.arrayBuffer();
            setPreviewData(JSON.parse(Buffer.from(file).toString()));
          });
          break;
        case "xml":
          setPreviewData(props.ubl);
          setLoading(false);
          break;
        default:
          break;
      }
    };
    if (previewHidden) return;
    fetchData();
    // eslint-disable-next-line
  }, [style, language, outputType, iconFile, previewHidden]);

  return (
    <>
      <Box sx={{ display: "flex", height: "100%" }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: `${!previewHidden ? "flex" : "none"}`,
            width: `calc(100% - ${drawerWidth})`,
          }}
        >
          {loading ? (
            <Box sx={{ margin: "auto auto" }}>
              <CircularProgress color="primary" size={60} />
            </Box>
          ) : error ? (
            <Box sx={{ margin: "auto auto" }}>
              <Typography>{error}</Typography>
            </Box>
          ) : ["pdf", "html"].includes(outputType) ? (
            <iframe
              src={previewData}
              width="100%"
              height="100%"
              style={{ border: 0 }}
            ></iframe>
          ) : outputType === "json" ? (
            <JsonViewer
              value={previewData}
              theme={theme.palette.mode}
              style={{ width: "100%", overflowY: "scroll" }}
            />
          ) : (
            <XMLViewer
              xml={previewData}
              collapsible
              indentSize={4}
              theme={
                theme.palette.mode === "light" ? lightXMLTheme : darkXMLTheme
              }
              style={{
                overflowY: "scroll",
                width: "100%",
              }}
            />
          )}
        </Box>
        <Box
          sx={{
            minWidth: `${!previewHidden ? { drawerWidth } : "100%"}`,
            overflowY: "scroll",
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              alignContent: "right",
            },
          }}
        >
          <ExportOptionsPanel
            ubl={props.ubl}
            outputType={outputType}
            setOutputType={setOutputType}
            language={language}
            setLanguage={setLanguage}
            style={style}
            setStyle={setStyle}
            iconFile={iconFile}
            setIconFile={setIconFile}
          />
        </Box>
      </Box>
    </>
  );
}
