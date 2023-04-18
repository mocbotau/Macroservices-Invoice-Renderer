import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import PersonIcon from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import { SetStateType } from "@src/interfaces";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import ContactsIcon from "@mui/icons-material/Contacts";

interface ComponentProps {
  showMenu: null | HTMLElement;
  setShowMenu: SetStateType<null | HTMLElement>;
  name: string;
}

export default function AccountMenu(props: ComponentProps) {
  const { showMenu, setShowMenu, name } = props;
  const router = useRouter();

  const open = Boolean(showMenu);

  const handleClose = () => {
    setShowMenu(null);
  };

  const handleLogout = async () => {
    setShowMenu(null);
    signOut();
    router.push("/");
  };

  return (
    <>
      <Menu
        anchorEl={showMenu}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem sx={{ pointerEvents: "none" }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          {`Hi, ${name}!`}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            router.push("/user/contacts");
          }}
        >
          <ListItemIcon>
            <ContactsIcon fontSize="small" />
          </ListItemIcon>
          Manage Contacts
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
