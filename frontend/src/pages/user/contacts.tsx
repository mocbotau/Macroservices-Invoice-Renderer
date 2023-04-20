import {
  Alert,
  AlertProps,
  Avatar,
  Box,
  Button,
  Paper,
  Snackbar,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import { getSession } from "next-auth/react";
import { stringAvatar } from "@src/utils";
import { GetServerSidePropsContext } from "next";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
  GridEditInputCell,
} from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";
import { DBAll } from "@src/utils/DBHandler";
import { Api } from "@src/Api";
import * as EmailValidator from "email-validator";
import { INTERNATIONAL_NUMBER_REGEX } from "@src/constants";
import { SessionWithSub } from "@src/interfaces";

export interface ServerSideProps {
  user: SessionWithSub["user"];
  initialRows: GridRowsProp;
}

let session: SessionWithSub;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  session = await getSession(context);

  const res = await DBAll(
    "SELECT ID AS id, Name AS name, EmailAddress AS email, PhoneNumber AS phone FROM ContactDetails WHERE Account = ?",
    [session?.user?.email || session?.user?.sub]
  );

  return {
    props: { user: session?.user || null, initialRows: res }, // will be passed to the page component as props
  };
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = uuidv4();
    setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Contact
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid(props: ServerSideProps) {
  const { user, initialRows } = props;

  const account = user.email || user.sub;

  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
    Api.deleteContact(id as string);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    const res = await Api.editContact(
      newRow.id,
      account,
      newRow.name,
      newRow.email,
      newRow.phone
    );

    if (res.status !== 200) {
      throw new Error(res.json.error);
    }

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    setSnackbar({ children: "User successfully saved", severity: "success" });
    return updatedRow;
  };

  const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  }));

  function NameEditInputCell(props: GridRenderEditCellParams) {
    const { error } = props;

    return (
      <StyledTooltip open={!!error} title={error}>
        <GridEditInputCell {...props} />
      </StyledTooltip>
    );
  }

  function renderEditName(params: GridRenderEditCellParams) {
    return <NameEditInputCell {...params} />;
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  const preProcessEmailCellProps = async (
    params: GridPreProcessEditCellProps
  ) => {
    const errorMessage =
      EmailValidator.validate(params.props.value) ||
      !params.props.value
        ? null
        : "Please enter a valid email";
    return { ...params.props, error: errorMessage };
  };

  const preProcessPhoneCellProps = async (
    params: GridPreProcessEditCellProps
  ) => {
    const errorMessage =
      INTERNATIONAL_NUMBER_REGEX.test(params.props.value) ||
      !params.props.value
        ? null
        : "Enter a valid number. Include the country code with +.";
    return { ...params.props, error: errorMessage };
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      editable: true,
      minWidth: 200,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      editable: true,
      minWidth: 250,
      preProcessEditCellProps: preProcessEmailCellProps,
      renderEditCell: renderEditName,
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      editable: true,
      preProcessEditCellProps: preProcessPhoneCellProps,
      renderEditCell: renderEditName,
      minWidth: 200,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      minWidth: 130,
      flex: 1,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="Save"
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              key="Cancel"
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            key="Edit"
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            key="Delete"
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: "100%", padding: 4 }}>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      <Paper elevation={6}>
        <Box display={"flex"} sx={{ padding: 3 }}>
          <Avatar
            alt={props.user.name}
            {...stringAvatar(props.user as SessionWithSub["user"])}
          />
          <Typography variant="h4" fontWeight={600} sx={{ marginLeft: 3 }}>
            Hello
          </Typography>
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{ marginLeft: 1 }}
            color="primary"
          >
            {`${props.user.name}!`}
          </Typography>
        </Box>
      </Paper>

      <Typography
        color="primary"
        variant="h5"
        fontWeight={600}
        sx={{ paddingY: 2 }}
      >
        Manage Contacts
      </Typography>
      <Paper
        elevation={6}
        sx={{ height: "80%", minHeight: "400px" }}
        component={DataGrid}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
