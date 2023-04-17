import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Menu,
  MenuItem,
  Select,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbar,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";

import { NextSeo } from "next-seo";
import { uploadFile } from "@src/utils";
import {
  deleteInvoice,
  getInvoices,
  loadFieldStates,
  loadUBL,
  newInvoice,
  setUBL,
} from "@src/persistence";
import { useRouter } from "next/router";
import { Api } from "@src/Api";

export default function Dashboard() {
  const theme = useTheme();
  const { push } = useRouter();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [rows, setRows] = useState([]);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [previewError, setPreviewError] = useState(null);

  const columns: GridColDef[] = [
    { field: "id", headerName: "#", flex: 1 },
    { field: "customer", headerName: "Customer", flex: 5 },
    { field: "amountDue", headerName: "Amount", flex: 3 },
    { field: "issueDate", headerName: "Issued", flex: 3 },
    { field: "dueDate", headerName: "Due", flex: 3 },
    {
      field: "actions",
      type: "actions",
      flex: 4,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            loadFieldStates(params.id.valueOf() as number) === null ? (
              <EditIcon />
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
                <EditIcon />
              </Badge>
            )
          }
          disabled={loadFieldStates(params.id.valueOf() as number) === null}
          onClick={() => {
            setUBL(undefined, params.id.valueOf() as number);
            push(`/editor/${params.id}`);
          }}
          label="Edit"
        />,
        <GridActionsCellItem
          icon={<ShareIcon />}
          disabled={loadUBL(params.id.valueOf() as number) === null}
          onClick={() => push(`/editor/${params.id}`)}
          label="Share"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          onClick={() => setToBeDeletedId(params.id)}
          label="Delete"
        />,
      ],
    },
  ];

  const handleCSVUpload = async () => {
    try {
      const f = await uploadFile(".csv");
      const newId = await newInvoice(f, null, null);

      push(`/editor/${newId}`);
    } catch (e) {
      if (typeof e === "string") {
        setSnackbarMessage(e);
      } else {
        setSnackbarMessage(e.toString());
      }
      setShowSnackbar(true);
    }
  };

  const handleUBLUpload = async () => {
    //try {
    const f = await uploadFile(".xml");

    const bytes = await f.arrayBuffer();
    const xml = Buffer.from(bytes).toString();
    const newId = await newInvoice(null, null, null);
    setUBL(xml, newId);

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

  const generatePreview = async (params) => {
    if (loadUBL(params.id.valueOf() as number) === null) {
      setPreviewHtml(null);
      setPreviewError("Create this invoice to enable preview.");
      return;
    }
    try {
      const resp = await Api.renderToHTML(
        loadUBL(params.id.valueOf() as number),
        0,
        "en",
        {}
      );
      let rawHtml = await resp.blob.text();
      rawHtml = `<!DOCTYPE html><html style="display:flex"><body style="transform:scale(0.6,0.6);transform-origin:top left;${rawHtml.substring(
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
  };

  useEffect(() => {
    setRows(getInvoices());
  }, []);

  return (
    <>
      <NextSeo title="Dashboard" />
      <CssBaseline />

      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          height: 100%;
        }
      `}</style>

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

      <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h3">Invoices</Typography>
        <Button
          key="new_button"
          sx={{ width: "10%", mt: 1 }}
          variant="contained"
          onClick={(e) => {
            setMenuAnchor(e.target);
          }}
        >
          New
          <ExpandMoreIcon sx={{ pointerEvents: "none" }} />
        </Button>
        <Menu
          open={Boolean(menuAnchor)}
          anchorEl={menuAnchor}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              handleCSVUpload();
            }}
          >
            Upload CSV
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              handleUBLUpload();
            }}
          >
            Upload UBL
          </MenuItem>
        </Menu>
        <Grid container sx={{ pt: 2, height: "100%" }} spacing={2}>
          <Grid item xs={12} md={8}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
                columns: { columnVisibilityModel: { id: false } },
              }}
              pageSizeOptions={[5]}
              disableColumnMenu
              slots={{
                toolbar: GridToolbar,
              }}
              slotProps={{
                columnsPanel: {
                  getTogglableColumns: () =>
                    columns
                      .map((x) => x.field)
                      .filter(
                        (x) => !["customer", "actions", "id"].includes(x)
                      ),
                },
              }}
              onRowClick={generatePreview}
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
