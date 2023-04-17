import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import MacroLogo from "@public/MacroservicesLogo2.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AccountMenu from "./NavBar/AccountMenu";
import React, { useState } from "react";

const pages = ["Dashboard", "About Us"];

function NavBar() {
  const router = useRouter();
  const { data } = useSession();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  function stringToColor(string: string) {
    let hash = 0;

    /* eslint-disable no-bitwise */
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: data.user.image
        ? undefined
        : `${name.split(" ")[0][0].toUpperCase()}${
            name.split(" ").length <= 1
              ? ""
              : name.split(" ")[1][0].toUpperCase()
          }`,
      src: data.user.image ? data.user.image : undefined,
    };
  }
  return (
    <AppBar position="static" id="navbar">
      <Container maxWidth="xl">
        <Toolbar disableGutters={router.pathname !== "/editor"}>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <Image
              src={MacroLogo}
              alt="Macroservices Logo"
              width="30"
              height="30"
            />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Image
              src={MacroLogo}
              alt="Macroservices Logo"
              width="30"
              height="30"
            />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {router.pathname !== "/login" && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {data ? (
                    <Avatar
                      alt={data.user.name}
                      {...stringAvatar(data.user.name)}
                    />
                  ) : (
                    <Typography>LOGIN</Typography>
                  )}
                </IconButton>
              </Tooltip>
              <AccountMenu
                showMenu={anchorElUser}
                setShowMenu={setAnchorElUser}
                name={data?.user?.name}
              />
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
