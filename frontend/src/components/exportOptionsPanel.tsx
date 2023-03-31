import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Api } from "@src/Api";
import { downloadFile } from "@src/utils";
import { useState } from "react";

export default function ExportOptionsPanel(props: { ubl: string }) {
  const theme = useTheme();

  const [textError, setTextError] = useState("");
  const [textSuccess, setTextSuccess] = useState("");

  const [exportMethod, setExportMethod] = useState("download");
  const [outputType, setOutputType] = useState("pdf");
  const [language, setLanguage] = useState("en");
  const [style, setStyle] = useState(0);

  const [exporting, setExporting] = useState(false);

  const exportDocument = async () => {
    setExporting(true);

    let response: { status: number; blob: Blob };

    switch (outputType) {
      case "pdf":
        response = await Api.renderToPDF(props.ubl, style, language);
        break;
      case "html":
        response = await Api.renderToHTML(props.ubl, style, language);
        break;
      case "json":
        response = await Api.renderToJSON(props.ubl);
        break;
      default:
        console.error("Unknown export type!");
        setExporting(false);
        return;
    }

    if (response.status !== 200) {
      setTextError("An unexpected error occurred.");
    } else {
      setTextSuccess("Exported successfully!");
      downloadFile(response.blob, `export.${outputType}`);
    }

    setExporting(false);
  };

  return (
    <Box
      p={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Box sx={{ overflowY: "auto" }} mb={2}>
        <Typography textAlign="center" variant="h5" mb={2}>
          Export Options
        </Typography>

        <FormControl fullWidth data-testid="export-method-form">
          <InputLabel id="export-method-label">Export Method</InputLabel>
          <Select
            labelId="export-method-label"
            value={exportMethod}
            label="Export Method"
            onChange={(e) => setExportMethod(e.target.value)}
          >
            <MenuItem value="download" data-testid="download-option">
              Download
            </MenuItem>
            <MenuItem value="send" data-testid="send-option">
              Send
            </MenuItem>
          </Select>
        </FormControl>

        <Box height={theme.spacing(2)} />

        <Box display={exportMethod === "send" ? "block" : "none"} mb={2}>
          <TextField label="Recipient" variant="outlined" fullWidth />
        </Box>

        <FormControl fullWidth data-testid="output-type-form">
          <InputLabel id="output-type-label">Output Type</InputLabel>
          <Select
            labelId="output-type-label"
            value={outputType}
            label="Output Type"
            onChange={(e) => setOutputType(e.target.value)}
          >
            <MenuItem value="pdf" data-testid="pdf-option">
              PDF
            </MenuItem>
            <MenuItem value="html" data-testid="html-option">
              HTML
            </MenuItem>
            <MenuItem value="json" data-testid="json-option">
              JSON
            </MenuItem>
          </Select>
        </FormControl>

        <Box display={outputType === "json" ? "none" : "block"}>
          <Box height={theme.spacing(2)} />

          <FormControl fullWidth data-testid="language-form">
            <InputLabel id="language-label">Language</InputLabel>
            <Select
              labelId="language-label"
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="en" data-testid="english-option">
                English
              </MenuItem>
              <MenuItem value="zh" data-testid="chinese-option">
                Chinese
              </MenuItem>
              <MenuItem value="es" data-testid="spanish-option">
                Spanish
              </MenuItem>
              <MenuItem value="ko" data-testid="korean-option">
                Korean
              </MenuItem>
              <MenuItem value="ja" data-testid="japanese-option">
                Japanese
              </MenuItem>
            </Select>
          </FormControl>

          <Box height={theme.spacing(2)} />

          <FormControl fullWidth data-testid="style-form">
            <InputLabel id="style-label">Style</InputLabel>
            <Select
              labelId="style-label"
              value={style}
              label="Style"
              onChange={(e) => setStyle(e.target.value as number)}
            >
              <MenuItem value={0} data-testid="style-option-0">
                Default
              </MenuItem>
              <MenuItem value={1} data-testid="style-option-1">
                Landscape
              </MenuItem>
              <MenuItem value={2} data-testid="style-option-2">
                Detailed
              </MenuItem>
              <MenuItem value={3} data-testid="style-option-3">
                Summary
              </MenuItem>
              <MenuItem value={4} data-testid="style-option-4">
                Default High Contrast
              </MenuItem>
            </Select>
          </FormControl>

          <Typography textAlign="center" variant="h6" mt={2} mb={1}>
            Components to render
          </Typography>

          <Typography textAlign="center">TODO</Typography>
        </Box>
      </Box>
      <Box>
        <Button
          fullWidth
          variant="contained"
          onClick={exportDocument}
          disabled={exporting}
          data-testid="export-button"
        >
          {exportMethod === "download" ? "Export" : "Send"}
        </Button>
      </Box>

      <Snackbar
        open={Boolean(textError)}
        autoHideDuration={3000}
        onClose={() => setTextError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error">{textError}</Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(textSuccess)}
        autoHideDuration={3000}
        onClose={() => setTextSuccess("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success">{textSuccess}</Alert>
      </Snackbar>
    </Box>
  );
}
