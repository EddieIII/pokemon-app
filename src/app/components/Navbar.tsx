"use client";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#C62828" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          🎮 Pokédex
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" onClick={() => window.location.href = "/"}>หน้าแรก</Button>
          <Button color="inherit" onClick={() => window.location.href = "/about"}>About</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}