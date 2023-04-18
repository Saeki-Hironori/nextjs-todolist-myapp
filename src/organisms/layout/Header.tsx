import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/Login");
      })
      .catch((error) => {
        // エラー起きんな！
      });
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "green" }}>
      <AppBar position="static">
        <Toolbar sx={{ bgcolor: "green" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <p style={{ flex: "1" }}>{user?.email}</p>
          <p style={{ flex: "1" }}>（{user?.uid}）</p>
          <div style={{ flex: "5" }}></div>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleLogout}
            sx={{ width: "30px" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
