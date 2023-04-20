import {
  Alert,
  Box,
  Button,
  FormControl,
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
} from "@mui/material";
import { CircularProgressWithLabel } from "../CircularProgressWithLabel";
import { Api } from "@src/Api";
import { downloadFile } from "@src/utils";
import { useContext, useEffect, useState } from "react";
import * as EmailValidator from "email-validator";
import { Emails, PhoneNumbers, SetStateType } from "@src/interfaces";
import {
  INTERNATIONAL_NUMBER_REGEX,
  SUPPORTED_LANGUAGES,
} from "@src/constants";
import { Delete } from "@mui/icons-material";
import { SEND_TIMEOUT_MS } from "@src/constants";
import { toBase64 } from "@src/utils";
import { useDropzone } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { FileRejection } from "react-dropzone";
import { ContactsContext } from "@src/pages/editor/[id]";
import Link from "next/link";

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

  const [textError, setTextError] = useState("");
  const [fileErrors, setFileErrors] = useState(null);
  const [textSuccess, setTextSuccess] = useState("");
  const [exportMethod, setExportMethod] = useState("download");
  const [emailList, setEmailList] = useState<string[]>([]);
  const [smsRecipient, setSMSRecipient] = useState("");
  const [invalidEmails, setInvalidEmails] = useState("");
  const [invalidPhone, setInvalidPhone] = useState("");
  const [exporting, setExporting] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendTimeout, setSendTimeout] = useState<number>(0);

  const { emails, phones } = useContext(ContactsContext);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
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
    if (emailList.some((email) => !EmailValidator.validate(email))) {
      setInvalidEmails("Invalid emails detected.");
    } else {
      setInvalidEmails("");
    }
  }, [emailList]);

  useEffect(() => {
    if (
      !INTERNATIONAL_NUMBER_REGEX.test(smsRecipient) &&
      smsRecipient.length !== 0
    ) {
      setInvalidPhone("Invalid phone number. Include country code with +.");
    } else {
      setInvalidPhone("");
    }
  }, [smsRecipient]);

  const handleEmailBoxChange = (
    event: React.SyntheticEvent,
    value: Emails[]
  ) => {
    setEmailList(value.map((email) => email.email || `${email}`));
  };

  const handlePhoneBoxChange = (event: React.SyntheticEvent, value: string) => {
    setSMSRecipient(value);
  };

  const exportDocument = async () => {
    setTextError("");
    setTextSuccess("");

    if (exportMethod === "send-export") {
      if (emailList.length === 0) {
        setInvalidEmails("At least one recipient is required.");
        return;
      } else if (invalidEmails.length !== 0) {
        return;
      }
    } else if (exportMethod === "send-sms") {
      if (smsRecipient.length === 0) {
        setInvalidPhone("Please provide a phone number.");
        return;
      } else if (invalidPhone.length !== 0) {
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
            exportMethod === "send-email" ? emailList.join(",") : smsRecipient,
            exportMethod === "send-sms" ? "sms" : "email",
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

  return (
    <Box
      p={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
      }}
    >
      <Box mb={2}>
        <Typography
          variant="h6"
          color="primary"
          gutterBottom={true}
          fontWeight={600}
          sx={{ paddingBottom: 1, width: "100%" }}
        >
          Export and Send
        </Typography>
        <Box display="flex">
          <FormControl fullWidth data-testid="export-method-form">
            <InputLabel id="export-method-label">Export Method</InputLabel>
            <Select
              labelId="export-method-label"
              value={exportMethod}
              label="Export Method"
              onChange={(e) => {
                setExportMethod(e.target.value);
                if (e.target.value === "send-sms") {
                  setOutputType("xml");
                } else {
                  setOutputType("pdf");
                }
              }}
            >
              <MenuItem value="download" data-testid="download-option">
                Download
              </MenuItem>
              <MenuItem value="send-email" data-testid="send-email-option">
                Send Email
              </MenuItem>
              <MenuItem value="send-sms" data-testid="send-sms-option">
                Send SMS
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box height={theme.spacing(2)} />

        <Box display={exportMethod.includes("send") ? "block" : "none"} mb={2}>
          {exportMethod === "send-email" && (
            <>
              <Alert severity="info" sx={{ marginBottom: 2 }}>
                {`Search for and select contacts to email. Alternatively, type a new email and press enter. `}
                <Link
                  href={"/user/contacts"}
                  style={{ color: "rgb(184, 231, 251)" }}
                >
                  You can manage your contacts here.
                </Link>
              </Alert>
              <Autocomplete
                multiple
                options={emails}
                autoHighlight
                limitTags={2}
                disableCloseOnSelect
                getOptionLabel={(option: Emails) => option?.name || `${option}`}
                onChange={handleEmailBoxChange}
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
                  value.map((option: Emails | string, index: number) => (
                    <Chip
                      variant="filled"
                      key={(option as Emails).email || (option as string)}
                      label={(option as Emails).email || (option as string)}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Email"
                    helperText={invalidEmails}
                    error={!!invalidEmails}
                  />
                )}
                sx={{ flex: 1 }}
              />
            </>
          )}
          {exportMethod === "send-sms" && (
            <>
              <Alert severity="info" sx={{ marginBottom: 2 }}>
                {`Search for and select a phone number to send a message to. Alternatively, type a new number. `}
                <Link
                  href={"/user/contacts"}
                  style={{ color: "rgb(184, 231, 251)" }}
                >
                  You can manage your contacts here.
                </Link>
                {
                  " This invoice will be sent as a summary to the specified recipient."
                }
              </Alert>
              <Autocomplete
                options={phones}
                autoHighlight
                getOptionLabel={(option: PhoneNumbers) =>
                  option?.phone || `${option}`
                }
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <>
                      <Typography>
                        {option.name}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontStyle: "italic" }}
                        >
                          {option.phone}
                        </Typography>
                      </Typography>
                    </>
                  </Box>
                )}
                freeSolo
                onInputChange={handlePhoneBoxChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Phone Number"
                    helperText={invalidPhone}
                    error={!!invalidPhone}
                  />
                )}
                sx={{ flex: 1 }}
              />
            </>
          )}
        </Box>
        {exportMethod !== "send-sms" && (
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
            ["json", "xml"].includes(outputType) || exportMethod === "send-sms"
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

          <Typography variant="h6" mt={2} mb={1} color="primary">
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
                  borderColor: `${isDragActive ? "#ab47bc" : ""}`,
                  borderWidth: "2px",
                  transition: "border-color 0.15s ease-in-out",
                }}
                {...getRootProps({ className: "dropzone" })}
              >
                <input {...getInputProps()} />
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    cursor: "pointer",
                    width: "90%",
                  }}
                >
                  <UploadFileIcon />
                  <Typography>
                    {acceptedFiles.length > 0
                      ? (acceptedFiles[0] as DragDropFile).path.length >= 25
                        ? (acceptedFiles[0] as DragDropFile).path
                            .slice(0, 25)
                            .concat("...")
                        : (acceptedFiles[0] as DragDropFile).path
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
            `Send ${exportMethod === "send-sms" ? "SMS" : "Email"}`
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
