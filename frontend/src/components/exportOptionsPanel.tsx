import {
  Alert,
  Box,
  Button,
  FormControl,
  InputAdornment,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  useTheme,
  Card,
  Autocomplete,
  Chip,
  Stack,
} from "@mui/material";
import { CircularProgressWithLabel } from "./CircularProgressWithLabel";
import { Api } from "@src/Api";
import { downloadFile } from "@src/utils";
import { useEffect, useState } from "react";
import * as EmailValidator from "email-validator";
import { InvoiceSendOptions, SetStateType } from "@src/interfaces";
import { SUPPORTED_LANGUAGES } from "@src/constants";
import { Delete } from "@mui/icons-material";
import { SEND_TIMEOUT_MS } from "@src/constants";
import { toBase64 } from "@src/utils";
import { useDropzone } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { FileRejection } from "react-dropzone";
import useWindowDimensions from "@src/utils/useWindowDimensions";

type CustomSendType = InvoiceSendOptions | "";

interface DragDropFile extends File {
  path: string;
}

interface ComponentProps {
  ubl: string;
  outputType: string;
  setOutputType: SetStateType<string>;
  language: string;
  setLanguage: SetStateType<string>;
  style: number;
  setStyle: SetStateType<number>;
  iconFile: File;
  setIconFile: SetStateType<File>;
}

export default function ExportOptionsPanel(props: ComponentProps) {
  const {
    outputType,
    setOutputType,
    language,
    setLanguage,
    style,
    setStyle,
    iconFile,
    setIconFile,
    ubl,
  } = props;
  const theme = useTheme();
  const drawerWidth = theme.spacing(50);

  const [textError, setTextError] = useState("");
  const [fileErrors, setFileErrors] = useState(null);
  const [textSuccess, setTextSuccess] = useState("");
  const [exportMethod, setExportMethod] = useState("download");
  const [recipient, setRecipient] = useState("");
  const [sendType, setSendType] = useState<CustomSendType>("email");
  const [invalidRecipient, setInvalidRecipient] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendTimeout, setSendTimeout] = useState<number>(0);
  const { width } = useWindowDimensions();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
    maxSize: 5000000,
    onDropAccepted: (files: Array<File>) => {
      setFileErrors(null);
      setIconFile(files[0]);
    },
    onError: (err: Error) => {
      setTextError(err.message);
    },
    onDropRejected: (fileRejections: Array<FileRejection>) => {
      console.log(fileRejections[0]);

      const errors = fileRejections[0].errors.map((obj) => {
        switch (obj.code) {
          case "file-invalid-type":
            return "File must be .jpg, .jpeg or .png";
          case "file-too-large":
            return "File must be less than 5MB";
          default:
            return obj.message;
        }
      });
      setFileErrors(errors);
    },
  });

  useEffect(() => {
    if (EmailValidator.validate(recipient)) {
      setSendType("email");
      setOutputType("pdf");
      setInvalidRecipient(false);
    } else if (
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(recipient)
    ) {
      if (/^[0-9]{10}$/.test(recipient)) {
        setRecipient(`+61${recipient.substring(1)}`);
      }
      setSendType("sms");
      setOutputType("xml");
      setInvalidRecipient(false);
    } else {
      setOutputType("pdf");
      setSendType("");
    }
    // eslint-disable-next-line
  }, [recipient]);

  useEffect(() => {
    if (exportMethod === "send" && sendType === "sms") {
      setOutputType("xml");
    } else {
      setOutputType("pdf");
    }
    // eslint-disable-next-line
  }, [exportMethod]);

  const exportDocument = async () => {
    setTextError("");
    setTextSuccess("");

    if (exportMethod === "send") {
      if (!recipient) {
        setTextError("Recipient is required");
        setInvalidRecipient(true);
        return;
      } else if (sendType === "") {
        setTextError("Invalid recipient, must be an email or phone number");
        setInvalidRecipient(true);
        return;
      }
    }

    setExporting(true);

    const optional = {};
    try {
      if (iconFile) optional["icon"] = await toBase64(iconFile);
    } catch {
      setTextError("Failed to read icon file.");
      setExporting(false);
      return;
    }

    let response: { status: number; blob: Blob };

    try {
      switch (outputType) {
        case "pdf":
          response = await Api.renderToPDF(ubl, style, language, optional);
          break;
        case "html":
          response = await Api.renderToHTML(ubl, style, language, optional);
          break;
        case "json":
          response = await Api.renderToJSON(ubl);
          break;
        case "xml":
          response = { status: 200, blob: new Blob([ubl]) };
          break;
        default:
          console.error("Unknown export type!");
          setExporting(false);
          return;
      }

      if (response.status !== 200) {
        setTextError("An error occurred when rendering the invoice");
      } else {
        if (exportMethod === "download") {
          setTextSuccess("Exported successfully!");
          downloadFile(response.blob, `export.${outputType}`);
        } else {
          setSending(true);
          const { status } = await Api.sendInvoice(
            recipient,
            sendType as InvoiceSendOptions,
            outputType,
            response.blob
          );
          if (status !== 200) {
            setTextError("An error occurred when sending the invoice");
            setSending(false);
          } else {
            setTextSuccess("Sent successfully!");
            setSendTimeout(SEND_TIMEOUT_MS);
            setTimeout(() => {
              setSending(false);
              setSendTimeout(null);
            }, SEND_TIMEOUT_MS);
          }
        }
        setExporting(false);
      }
    } catch (err) {
      setTextError("An error occurred when sending the invoice");
      setExporting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSendTimeout(Math.max(sendTimeout - 1000, 0));
    }, 1000);
    if (sendTimeout === 0) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [sendTimeout]);

  interface Emails {
    name: string;
    email: string;
  }

  const emails: readonly Emails[] = [
    { name: "Samuel Zheng", email: "samuel.zheng1357@gmail.com" },
    { name: "Brandon", email: "brandon@brandon.com" },
    { name: "Jason", email: "jason@jason.com" },
  ];

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
      <Box mb={2}>
        <Typography
          variant="h6"
          color="primary"
          gutterBottom={true}
          fontWeight={600}
          sx={{ paddingBottom: 1 }}
        >
          Export and Send
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

        <Box
          display={exportMethod === "send" ? "block" : "none"}
          mb={2}
          maxWidth={`${width <= 768 ? width : `calc(${drawerWidth} - 57px)`}`}
        >
          {/* <Autocomplete
            multiple
            id="tags-filled"
            options={emails}
            autoHighlight
            getOptionLabel={(option: Emails) => option.name}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <>
                  <Typography>
                    {option.name}
                    <Typography
                      variant="subtitle2"
                      sx={{ fontStyle: "italic" }}
                    >
                      {option.email}
                    </Typography>
                  </Typography>
                </>
              </Box>
            )}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option: Emails | string[], index: number) => (
                <Chip
                  variant="filled"
                  label={(option.email as Emails["email"]) || option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Email"
                placeholder="Enter emails..."
              />
            )}
          /> */}
        </Box>
        {sendType === "sms" && exportMethod === "send" ? (
          <Alert severity="info">
            This invoice will be sent as a summary to the specified recipient
            above.
          </Alert>
        ) : (
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
              <MenuItem value="xml" data-testid="xml-option">
                XML
              </MenuItem>
            </Select>
          </FormControl>
        )}

        <Box
          display={
            ["json", "xml"].includes(outputType) ||
            (exportMethod === "send" && sendType === "sms")
              ? "none"
              : "block"
          }
        >
          <Box height={theme.spacing(2)} />

          <FormControl fullWidth data-testid="language-form">
            <InputLabel id="language-label">Language</InputLabel>
            <Select
              labelId="language-label"
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map((language) => (
                <MenuItem
                  value={language.langCode}
                  data-testid={language.langCode + "-option"}
                  key={language.langCode}
                >
                  {language.language}
                </MenuItem>
              ))}
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
            Optional Components
          </Typography>
          <Grid container sx={{ width: "100%" }} gap={2}>
            <Grid item xs={12}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  position: "relative",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    cursor: "pointer",
                    width: "90%",
                  }}
                  {...getRootProps({ className: "dropzone" })}
                >
                  <input {...getInputProps()} />
                  <UploadFileIcon />
                  <Typography>
                    {acceptedFiles.length > 0
                      ? (acceptedFiles[0] as DragDropFile).path
                      : "Upload or drag and drop your logo."}
                  </Typography>
                </Box>
                {acceptedFiles.length > 0 && (
                  <IconButton
                    onClick={() => {
                      acceptedFiles.splice(0, 1);
                      setIconFile(undefined);
                    }}
                    sx={{
                      height: "auto",
                      position: "absolute",
                      right: 10,
                      ":hover": {
                        color: "red",
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Card>
            </Grid>
            {fileErrors &&
              fileErrors.map((message: string, index: number) => {
                return (
                  <Grid item xs={12} key={index}>
                    <Alert severity="error">{message}</Alert>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Box>
      <Box>
        <Button
          fullWidth
          variant="contained"
          onClick={exportDocument}
          disabled={exportMethod === "download" ? exporting : sending}
          data-testid="export-button"
        >
          {sending ? (
            <CircularProgressWithLabel value={sendTimeout} />
          ) : exportMethod === "download" ? (
            "Export"
          ) : (
            `Send ${sendType === "sms" ? "SMS" : "Email"}`
          )}
        </Button>
      </Box>

      <Snackbar
        open={Boolean(textError)}
        autoHideDuration={3000}
        onClose={() => setTextError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">{textError}</Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(textSuccess)}
        autoHideDuration={3000}
        onClose={() => setTextSuccess("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">{textSuccess}</Alert>
      </Snackbar>
    </Box>
  );
}
