import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbar,
  GridValueSetterParams,
} from "@mui/x-data-grid";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import UpdateIcon from "@mui/icons-material/Update";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import PaidIcon from "@mui/icons-material/Paid";
import ReceiptIcon from "@mui/icons-material/Receipt";
import TableViewIcon from "@mui/icons-material/TableView";

import { NextSeo } from "next-seo";
import {
  compareDate,
  extractNumber,
  formatCurrency,
  uploadFile,
} from "@src/utils";
import {
  InvoiceState,
  deleteInvoice,
  getInvoices,
  loadFieldStates,
  loadFile,
  loadInvoiceState,
  loadUBL,
  newInvoice,
  setInvoiceState,
  saveUBL,
  updateInvoiceName,
} from "@src/persistence";
import { useRouter } from "next/router";
import { Api } from "@src/Api";
import { MOBILE_WIDTH, PAGE_WIDTH } from "@src/constants";
import { useDebounce } from "use-debounce";
import useWindowDimensions from "../utils/useWindowDimensions";

export default function Dashboard() {
  const theme = useTheme();
  const { push } = useRouter();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [rows, setRows] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [previewError, setPreviewError] = useState(
    "Select an invoice to enable preview."
  );
  const { width } = useWindowDimensions();
  const [windowWidth] = useDebounce(width, 1000);
  const [showLoading, setShowLoading] = useState(false);

  const invoiceSentOptions: {
    name: string;
    color:
      | "default"
      | "warning"
      | "success"
      | "error"
      | "primary"
      | "secondary"
      | "info";
  }[] = [
    { name: "Draft", color: "default" },
    { name: "Sent", color: "warning" },
    { name: "Paid", color: "success" },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "#", flex: 1, minWidth: 30 },
    {
      field: "name",
      headerName: "Invoice Name",
      flex: 4,
      minWidth: 120,
      editable: true,
      valueSetter: (params: GridValueSetterParams) => {
        const name = params.value;
        updateInvoiceName(params.row?.id, name);
        return { ...params.row, name };
      },
    },
    { field: "customer", headerName: "Customer", flex: 5, minWidth: 150 },
    { field: "amountDue", headerName: "Amount", flex: 3, minWidth: 90 },
    { field: "issueDate", headerName: "Issued", flex: 3, minWidth: 90 },
    {
      field: "dueDate",
      headerName: "Due",
      flex: 3,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ display: "inline", pr: 1 }}>
            {params.formattedValue}
          </Typography>
          {compareDate(params.formattedValue, 0) < 0 &&
          params.row.state !== InvoiceState.PAID ? (
            params.row.state === InvoiceState.DRAFT ? (
              <Tooltip title="Expired Invoice">
                <ErrorIcon color="error" />
              </Tooltip>
            ) : (
              <Tooltip title="Expired Unpaid Invoice">
                <WarningIcon color="error" />
              </Tooltip>
            )
          ) : (
            compareDate(params.formattedValue, 0) > 0 &&
            compareDate(params.formattedValue, 7) < 0 &&
            params.row.state !== InvoiceState.PAID &&
            (params.row.state === InvoiceState.DRAFT ? (
              <Tooltip title="Upcoming Unsent Invoice">
                <ErrorIcon color="warning" />
              </Tooltip>
            ) : (
              <Tooltip title="Upcoming Unpaid Invoice">
                <WarningIcon color="warning" />
              </Tooltip>
            ))
          )}
        </Box>
      ),
    },
    {
      field: "state",
      headerName: "State",
      flex: 3,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <Select
            sx={{ p: 1, width: "100%" }}
            variant="standard"
            value={loadInvoiceState(params.id.valueOf() as number)}
            onChange={(e) => {
              setInvoiceState(
                e.target.value as number,
                params.id.valueOf() as number
              );
              setRows(getInvoices());
            }}
            renderValue={(selected: number) => {
              return (
                <Chip
                  sx={{
                    width: "100%",
                  }}
                  color={invoiceSentOptions[selected].color}
                  label={invoiceSentOptions[selected].name}
                  size="small"
                  variant="filled"
                />
              );
            }}
            disableUnderline
          >
            {invoiceSentOptions.map((x, i) => (
              <MenuItem key={i} value={i}>
                {x.name}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "fileType",
      headerName: "File",
      width: 80,
      renderCell: (params) => (
        <Box sx={{ display: "flex" }}>
          <Chip
            size="small"
            label={loadFile(params.row.id) === null ? "XML" : "CSV"}
          />
        </Box>
      ),
    },
    {
      field: "actions",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            loadFieldStates(params.id.valueOf() as number) === null ? (
              <Tooltip title="Configure CSV">
                <EditIcon />
              </Tooltip>
            ) : (
              <Badge
                color="primary"
                badgeContent={
                  loadFieldStates(params.id.valueOf() as number).selectedRange
                    .data.length -
                  (loadFieldStates(params.id.valueOf() as number).hasHeaders
                    ? 1
                    : 0)
                }
              >
                <Tooltip title="Configure CSV">
                  <EditIcon />
                </Tooltip>
              </Badge>
            )
          }
          disabled={loadFile(params.id.valueOf() as number) === null}
          onClick={() => {
            setShowLoading(true);
            saveUBL(undefined, params.id.valueOf() as number);
            push(`/editor/${params.id}`);
          }}
          label="Edit"
          key="Edit"
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Export & Send">
              <ShareIcon />
            </Tooltip>
          }
          disabled={loadUBL(params.id.valueOf() as number) === null}
          onClick={() => {
            setShowLoading(true);
            push(`/editor/${params.id}`);
          }}
          label="Share"
          key="Share"
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Delete Invoice">
              <DeleteIcon />
            </Tooltip>
          }
          onClick={() => setToBeDeletedId(params.id)}
          label="Delete"
          key="Delete"
        />,
      ],
    },
  ];

  const handleCSVUpload = async () => {
    try {
      const f = await uploadFile(".csv");
      setShowLoading(true);
      const newId = await newInvoice(
        f,
        {
          fieldStates: {},
          dropdownOptions: [],
          selectedRange: { rangeString: "", data: [] },
          hasHeaders: false,
        },
        null
      );

      push(`/editor/${newId}`);
    } catch (e) {
      if (typeof e === "string") {
        setSnackbarMessage(e);
      } else {
        setSnackbarMessage(e.toString());
      }
      setShowSnackbar(true);
      setShowLoading(false);
    }
  };

  const handleUBLUpload = async () => {
    //try {

    const f = await uploadFile(".xml");
    setShowLoading(true);

    const bytes = await f.arrayBuffer();
    const xml = Buffer.from(bytes).toString();
    const newId = await newInvoice(null, null, null);
    saveUBL(xml, newId);

    push(`/editor/${newId}`);
    /*} catch (e) {
      if (typeof e === "string") {
        setSnackbarMessage(e);
      } else {
        setSnackbarMessage(e.toString());
      }
      setShowSnackbar(true);
    }*/
  };

  const generatePreview = useCallback(
    async (id: number) => {
      if (loadUBL(id) === null) {
        setPreviewHtml(null);
        setPreviewError("Create this invoice to enable preview.");
        return;
      }
      try {
        const resp = await Api.renderToHTML(loadUBL(id), 0, "en", {});
        let rawHtml = await resp.blob.text();

        // trust me bro
        const scalingFactor = (windowWidth - 140) / 3.6 / PAGE_WIDTH;
        rawHtml = `<!DOCTYPE html><html style="display:flex;height:0px"><body style="transform:scale(${scalingFactor},${scalingFactor});transform-origin:top left;${rawHtml.substring(
          '<!DOCTYPE html><html style="display:flex"><body style="'.length
        )}`;

        setPreviewHtml(
          URL.createObjectURL(new Blob([rawHtml], { type: "text/html" }))
        );
        setPreviewError(null);
      } catch {
        setPreviewHtml(null);
        setPreviewError("Could not render preview.");
      }
    },
    [setPreviewHtml, setPreviewError, windowWidth]
  );

  useEffect(() => {
    if (currentId === null)
      setPreviewError("Select an invoice to enable preview.");
    else generatePreview(currentId);
  }, [currentId, generatePreview]);

  useEffect(() => {
    setRows(getInvoices());
  }, []);

  const unpaidOverdueAmount = rows
    .filter(
      (x) => compareDate(x.dueDate, 0) < 0 && x.state === InvoiceState.SENT
    )
    .reduce((p, n) => p + extractNumber(n.amountDue), 0);

  const unsentOverdueInvoices = rows.filter(
    (x) => compareDate(x.dueDate, 0) < 0 && x.state === InvoiceState.DRAFT
  ).length;

  const unpaidUpcomingAmount = rows
    .filter(
      (x) =>
        compareDate(x.dueDate, 0) > 0 &&
        compareDate(x.dueDate, 7) < 0 &&
        x.state === InvoiceState.SENT
    )
    .reduce((p, n) => p + extractNumber(n.amountDue), 0);

  const unsentUpcomingInvoices = rows.filter(
    (x) =>
      compareDate(x.dueDate, 0) > 0 &&
      compareDate(x.dueDate, 7) < 0 &&
      x.state === InvoiceState.DRAFT
  ).length;

  const totalInvoicedAmount = rows
    .filter((x) => compareDate(x.dueDate, -30) > 0)
    .reduce((p, n) => p + extractNumber(n.amountDue), 0);

  const totalPaidAmount = rows
    .filter(
      (x) => compareDate(x.dueDate, -30) > 0 && x.state === InvoiceState.PAID
    )
    .reduce((p, n) => p + extractNumber(n.amountDue), 0);

  return (
    <>
      <NextSeo title="Dashboard" />

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackbar(false);
          setSnackbarMessage("");
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" data-testid="error-snackbar">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Menu
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            handleCSVUpload();
          }}
        >
          <ListItemIcon>
            <TableViewIcon fontSize="small" />
          </ListItemIcon>
          Upload CSV
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            handleUBLUpload();
          }}
        >
          <ListItemIcon>
            <ReceiptIcon fontSize="small" />
          </ListItemIcon>
          Upload UBL
        </MenuItem>
      </Menu>

      <Dialog
        open={toBeDeletedId !== null}
        onClose={() => setToBeDeletedId(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{"Delete this invoice?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This invoice will be deleted permanently.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToBeDeletedId(null)} autoFocus>
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteInvoice(toBeDeletedId);
              setRows(getInvoices());
              setToBeDeletedId(null);
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        p={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
      >
        <LinearProgress
          color="primary"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${showLoading ? "100%" : "0%"}`,
          }}
        />
        <Typography variant="h4" fontWeight={600} color="primary">
          Dashboard
        </Typography>

        <Grid
          container
          sx={{
            mt: 2,
            height: "30%",
          }}
          gap={2}
          wrap="nowrap"
        >
          <Paper
            elevation={6}
            component={Grid}
            item
            xs={4}
            sx={{
              p: 2,
              outline: "1px solid",
              borderRadius: "5px",
              outlineColor: theme.palette.divider,
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
              <NotificationImportantIcon
                fontSize={`${width <= MOBILE_WIDTH ? "small" : "medium"}`}
              />
              <Typography
                variant={`${width <= MOBILE_WIDTH ? "body1" : "h5"}`}
                pl={1}
                fontWeight={600}
              >
                Overdues
              </Typography>
            </Box>
            {unsentOverdueInvoices !== 0 && (
              <Box sx={{ display: "flex", alignItems: "center", pb: 1 }}>
                <ErrorIcon
                  color="error"
                  fontSize={`${width <= MOBILE_WIDTH ? "small" : "medium"}`}
                />
                <Typography
                  variant={`${width <= MOBILE_WIDTH ? "body2" : "body1"}`}
                  sx={{ display: "inline", pl: 1 }}
                >
                  Expired invoices: {unsentOverdueInvoices}
                </Typography>
              </Box>
            )}
            {unpaidOverdueAmount !== 0 && (
              <Box sx={{ display: "flex", alignItems: "center", pb: 1 }}>
                <WarningIcon
                  color="error"
                  fontSize={`${width <= MOBILE_WIDTH ? "small" : "medium"}`}
                />
                <Typography
                  variant={`${width <= MOBILE_WIDTH ? "body2" : "body1"}`}
                  sx={{ display: "inline", pl: 1 }}
                >
                  Unpaid total:{" "}
                  {formatCurrency({
                    "_text": unpaidOverdueAmount,
                    "$currencyID": "AUD",
                  })}
                </Typography>
              </Box>
            )}
            {unpaidOverdueAmount === 0 && unsentOverdueInvoices === 0 && (
              <Box sx={{ display: "flex", alignItems: "center", pb: 1 }}>
                <DoneAllIcon
                  color="success"
                  fontSize={`${width <= MOBILE_WIDTH ? "small" : "medium"}`}
                />
                <Typography
                  variant={`${width <= MOBILE_WIDTH ? "body2" : "body1"}`}
                  sx={{ display: "inline", pl: 1 }}
                >
                  No overdue invoices!
                </Typography>
              </Box>
            )}
          </Paper>
          <Paper
            elevation={6}
            component={Grid}
            item
            xs={4}
            sx={{
              p: 2,
              outline: "1px solid",
              borderRadius: "5px",
              outlineColor: theme.palette.divider,
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
              <UpdateIcon
                fontSize={`${width <= MOBILE_WIDTH ? "small" : "medium"}`}
              />
              <Typography
                variant={`${width <= MOBILE_WIDTH ? "body1" : "h5"}`}
                pl={1}
                fontWeight={600}
              >
                Upcoming
              </Typography>
            </Box>
            {unsentUpcomingInvoices !== 0 && (
              <Box sx={{ display: "flex", alignItems: "center", pb: 1 }}>
                <ErrorIcon
                  color="warning"
                  fontSize={`${width <= MOBILE_WIDTH ? "small" : "medium"}`}
                />
                <Typography
                  variant={`${width <= MOBILE_WIDTH ? "body2" : "body1"}`}
                  sx={{ display: "inline", pl: 1 }}
                >
                  Unsent invoices: {unsentUpcomingInvoices}
                </Typography>
              </Box>
            )}
            {unpaidUpcomingAmount !== 0 && (
              <Box sx={{ display: "flex", alignItems: "center", pb: 1 }}>
                <WarningIcon
                  color="warning"
                  fontSize={`${width <= MOBILE_WIDTH ? "small" : "medium"}`}
                />
                <Typography
                  variant={`${width <= MOBILE_WIDTH ? "body2" : "body1"}`}
                  sx={{ display: "inline", pl: 1 }}
                >
                  Pending amount:{" "}
                  {formatCurrency({
                    "_text": unpaidUpcomingAmount,
                    "$currencyID": "AUD",
                  })}
                </Typography>
              </Box>
            )}
            {unpaidUpcomingAmount === 0 && unsentUpcomingInvoices === 0 && (
              <Box sx={{ display: "flex", alignItems: "center", pb: 1 }}>
                <DoneAllIcon
                  color="success"
                  fontSize={`${width <= MOBILE_WIDTH ? "small" : "medium"}`}
                />
                <Typography
                  variant={`${width <= MOBILE_WIDTH ? "body2" : "body1"}`}
                  sx={{ display: "inline", pl: 1 }}
                >
                  No upcoming invoices!
                </Typography>
              </Box>
            )}
          </Paper>
          <Paper
            elevation={6}
            component={Grid}
            item
            xs={4}
            sx={{
              p: 2,
              outline: "1px solid",
              borderRadius: "5px",
              outlineColor: theme.palette.divider,
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
              <CurrencyExchangeIcon
                fontSize={`${width <= MOBILE_WIDTH ? "small" : "medium"}`}
              />
              <Typography
                variant={`${width <= MOBILE_WIDTH ? "body1" : "h6"}`}
                pl={1}
                fontWeight={600}
              >
                Monthly Cashflow
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", pb: 1 }}>
              <RequestQuoteIcon
                color="info"
                fontSize={`${width <= MOBILE_WIDTH ? "small" : "medium"}`}
              />
              <Typography
                variant={`${width <= MOBILE_WIDTH ? "body2" : "body1"}`}
                sx={{ display: "inline", pl: 1 }}
              >
                Invoiced total:{" "}
                {formatCurrency({
                  "_text": totalInvoicedAmount,
                  "$currencyID": "AUD",
                })}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", pb: 1 }}>
              <PaidIcon
                color="info"
                fontSize={`${width <= MOBILE_WIDTH ? "small" : "medium"}`}
              />
              <Typography
                variant={`${width <= MOBILE_WIDTH ? "body2" : "body1"}`}
                sx={{ display: "inline", pl: 1 }}
              >
                Received total:{" "}
                {formatCurrency({
                  "_text": totalPaidAmount,
                  "$currencyID": "AUD",
                })}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid container sx={{ pt: 2, height: "100%" }} spacing={2}>
          <Grid item xs={12} md={8} sx={{ position: "relative" }}>
            <Button
              key="new_button"
              size="small"
              sx={{
                minWidth: 80,
                width: "10%",
                mt: 1,
                position: "absolute",
                right: "8px",
                zIndex: 999,
              }}
              variant="contained"
              onClick={(e) => {
                setMenuAnchor(e.target);
              }}
            >
              New
              <ExpandMoreIcon sx={{ pointerEvents: "none" }} />
            </Button>
            <DataGrid
              sx={{ boxShadow: "1px 3px 10px rgba(0, 0, 0, 0.3)" }}
              rows={rows}
              columns={columns}
              density="comfortable"
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
                columns: {
                  columnVisibilityModel: { id: false, issueDate: false },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableColumnMenu
              slots={{
                toolbar: GridToolbar,
              }}
              slotProps={{
                columnsPanel: {
                  getTogglableColumns: () =>
                    columns
                      .map((x) => x.field)
                      .filter((x) => !["customer", "actions"].includes(x)),
                },
              }}
              onRowClick={(params) => setCurrentId(params.id)}
            />
          </Grid>
          <Grid item display={{ xs: "none", md: "block" }} md={4}>
            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderRadius: "5px",
                borderColor: theme.palette.divider,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "1px 3px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              {previewError ? (
                <Typography>{previewError}</Typography>
              ) : (
                <iframe
                  src={previewHtml}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
