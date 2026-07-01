"use client";
import { useState, useEffect } from "react";
import {
  Typography, Container, Card, CardContent,
  Avatar, Box, Pagination, Skeleton,
} from "@mui/material";
import Navbar from "./components/Navbar";

interface PokemonResponse {
  count: number;
  results: { name: string; url: string }[];
}

const LIMIT = 20;
const TOTAL = 1351;

const typeColors: Record<string, string> = {
  fire: "#F08030", water: "#6890F0", grass: "#78C850",
  electric: "#F8D030", psychic: "#F85888", ice: "#98D8D8",
  dragon: "#7038F8", dark: "#705848", fairy: "#EE99AC",
  normal: "#A8A878", fighting: "#C03028", flying: "#A890F0",
  poison: "#A040A0", ground: "#E0C068", rock: "#B8A038",
  bug: "#A8B820", ghost: "#705898", steel: "#B8B8D0",
};

function PokemonCard({ pokemon }: { pokemon: { name: string; url: string } }) {
  const pokemonId = pokemon.url.split("/")[6];
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then((r) => r.json())
      .then((d) => {
        setTypes(d.types.map((t: { type: { name: string } }) => t.type.name));
        setLoading(false);
      });
  }, [pokemonId]);

  const mainColor = typeColors[types[0]] ?? "#A8A878";

  if (loading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="text" width={60} />
          <Skeleton variant="text" width={100} />
          <Skeleton variant="rounded" width={60} height={24} />
        </CardContent>
      </Card>
    );
  }

  return (
    // ใช้ <a> ธรรมดา ไม่ต้อง import อะไรเพิ่ม
    <a href={`/pokemon/${pokemon.name}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <Card sx={{
        height: "100%", cursor: "pointer",
        transition: "all 0.2s ease",
        borderTop: `4px solid ${mainColor}`,
        "&:hover": { transform: "translateY(-6px)", boxShadow: `0 8px 24px ${mainColor}55` },
      }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <Avatar
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
            sx={{ width: 80, height: 80 }}
          />
          <Typography variant="caption" color="text.secondary">
            #{String(pokemonId).padStart(3, "0")}
          </Typography>
          <Typography variant="h6" sx={{ textTransform: "capitalize", textAlign: "center" }}>
            {pokemon.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center" }}>
            {types.map((t) => (
              <Box key={t} sx={{
                backgroundColor: typeColors[t], color: "white",
                borderRadius: 10, px: 1, py: 0.2,
                fontSize: 11, fontWeight: "bold", textTransform: "capitalize",
              }}>
                {t}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </a>
  );
}

export default function Home() {
  const [pokemonData, setPokemonData] = useState<PokemonResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const offset = (page - 1) * LIMIT;
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`)
      .then((r) => r.json())
      .then((data) => { setPokemonData(data); setLoading(false); });
  }, [page]);

  return (
    <>
      <Navbar />
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
          🎮 Pokédex — {TOTAL} Pokémon
        </Typography>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(3, minmax(0, 1fr))",
          md: "repeat(4, minmax(0, 1fr))",
        }}}>
          {loading
            ? Array.from({ length: LIMIT }).map((_, i) => (
                <Card key={i}>
                  <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Skeleton variant="circular" width={80} height={80} />
                    <Skeleton variant="text" width={60} />
                    <Skeleton variant="text" width={100} />
                    <Skeleton variant="rounded" width={60} height={24} />
                  </CardContent>
                </Card>
              ))
            : pokemonData?.results.map((pokemon) => (
                <PokemonCard key={pokemon.name} pokemon={pokemon} />
              ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(TOTAL / LIMIT)}
            page={page}
            onChange={(_, v) => { setPage(v); window.scrollTo(0, 0); }}
            color="primary" size="large"
            sx={{
              bgcolor: "#333", borderRadius: 2, p: 1,
              "& .MuiPaginationItem-root": {
                color: "#fff", border: "1px solid #666", fontWeight: "bold",
                "&:hover": { bgcolor: "#555" },
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#1976d2", borderColor: "#1976d2", color: "#fff",
              },
            }}
          />
        </Box>
      </Container>
    </>
  );
}