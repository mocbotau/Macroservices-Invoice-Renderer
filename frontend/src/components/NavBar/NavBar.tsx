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
import AccountMenu from "./AccountMenu";
import React, { useState } from "react";
import SpaceDashboardIcon from "@mui/icons-material/Dashboard";
import CodeIcon from "@mui/icons-material/Code";
import Link from "next/link";
import { stringAvatar } from "@src/utils";

const pages = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <SpaceDashboardIcon sx={{ marginRight: 2 }} />,
  },
  {
    name: "Developers",
    link: "/developers",
    icon: <CodeIcon sx={{ marginRight: 2 }} />,
  },
];

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

  const handleNavigatePage = (link: string) => {
    router.push(link);
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" id="navbar" sx={{}}>
      <Container maxWidth="xl">
        <Toolbar>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <Link href={"/"} style={{ display: "flex" }}>
              <Image
                src={MacroLogo}
                alt="Macroservices Logo"
                width="30"
                height="30"
              />
            </Link>
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
                <MenuItem
                  key={page.name}
                  onClick={() => handleNavigatePage(page.link)}
                >
                  {page.icon}
                  <Typography textAlign="center">{page.name}</Typography>
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
            <Link href={"/"} style={{ display: "flex" }}>
              <Image
                src={MacroLogo}
                alt="Macroservices Logo"
                width="30"
                height="30"
              />
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavigatePage(page.link)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          {router.pathname !== "/login" && (
            <Box sx={{ flexGrow: 0 }}>
              {data ? (
                <Tooltip title="User Menu">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={data.user.name}
                      {...stringAvatar(data?.user)}
                    />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  variant="text"
                  onClick={() => router.push("/login")}
                  color="inherit"
                  sx={{
                    p: 0,
                  }}
                >
                  LOGIN
                </Button>
              )}
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
