import { Box, Drawer, Typography, useTheme } from "@mui/material";
import ExportOptionsPanel from "./exportOptionsPanel";

export default function ExportOptions(props: { ubl: string }) {
  const theme = useTheme();

  const drawerWidth = theme.spacing(50);

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
        }}
      >
        <Typography sx={{ m: "auto" }}>Preview Unavailable</Typography>
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <ExportOptionsPanel ubl={props.ubl} />
      </Drawer>
    </Box>
  );
}
