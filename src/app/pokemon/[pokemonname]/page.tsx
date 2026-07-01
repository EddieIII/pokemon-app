"use client";
import { use, useEffect, useState, useRef } from "react";
import {
  Container, Typography, Avatar, Chip, Box,
  Button, Card, CardContent, LinearProgress, Skeleton,
} from "@mui/material";
import Navbar from "../../components/Navbar";

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  sprites: {
    front_default: string;
    other: { "official-artwork": { front_default: string } };
  };
  stats: { base_stat: number; stat: { name: string } }[];
  cries: { latest: string };
}

interface EvolutionChain {
  species: { name: string; url: string };
  evolves_to: EvolutionChain[];
}

const typeColors: Record<string, string> = {
  fire: "#F08030", water: "#6890F0", grass: "#78C850",
  electric: "#F8D030", psychic: "#F85888", ice: "#98D8D8",
  dragon: "#7038F8", dark: "#705848", fairy: "#EE99AC",
  normal: "#A8A878", fighting: "#C03028", flying: "#A890F0",
  poison: "#A040A0", ground: "#E0C068", rock: "#B8A038",
  bug: "#A8B820", ghost: "#705898", steel: "#B8B8D0",
};

function flattenEvolution(chain: EvolutionChain): { name: string; id: string }[] {
  const id = chain.species.url.split("/").filter(Boolean).pop() ?? "";
  const result = [{ name: chain.species.name, id }];
  if (chain.evolves_to.length > 0) {
    result.push(...flattenEvolution(chain.evolves_to[0]));
  }
  return result;
}

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ pokemonname: string }>;
}) {
  const { pokemonname } = use(params);
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [evolution, setEvolution] = useState<{ name: string; id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonname}`)
      .then((r) => r.json())
      .then(async (data) => {
        setPokemon(data);
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`);
        const speciesData = await speciesRes.json();
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();
        setEvolution(flattenEvolution(evoData.chain));
        setLoading(false);
      });
  }, [pokemonname]);

  const playSound = () => {
    if (!pokemon?.cries?.latest) return;
    if (audioRef.current) audioRef.current.pause();
    audioRef.current = new Audio(pokemon.cries.latest);
    audioRef.current.play();
  };

  const mainType = pokemon?.types[0]?.type?.name ?? "normal";
  const bgColor = typeColors[mainType] ?? "#A8A878";

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <Button variant="outlined" sx={{ mb: 2 }}>← กลับหน้าแรก</Button>
        </a>

        <Card>
          <Box sx={{
            background: `linear-gradient(135deg, ${bgColor}, ${bgColor}88)`,
            display: "flex", flexDirection: "column",
            alignItems: "center", py: 4, gap: 1,
          }}>
            {loading ? (
              <>
                <Skeleton variant="circular" width={150} height={150} />
                <Skeleton variant="text" width={100} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
                <Skeleton variant="text" width={180} height={48} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
              </>
            ) : (
              <>
                <Avatar
                  src={pokemon?.sprites.other["official-artwork"].front_default}
                  sx={{ width: 150, height: 150, bgcolor: "transparent" }}
                />
                <Typography variant="caption" sx={{ color: "white" }}>
                  #{String(pokemon?.id).padStart(3, "0")}
                </Typography>
                <Typography variant="h4" sx={{ textTransform: "capitalize", color: "white", fontWeight: "bold" }}>
                  {pokemon?.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {pokemon?.types.map((t) => (
                    <Chip key={t.type.name} label={t.type.name}
                      sx={{ bgcolor: "rgba(255,255,255,0.3)", color: "white",
                        textTransform: "capitalize", fontWeight: "bold" }}
                    />
                  ))}
                </Box>
                <Button onClick={playSound} variant="contained"
                  sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.25)", color: "white",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.4)" } }}>
                  🔊 เล่นเสียง
                </Button>
              </>
            )}
          </Box>

          <CardContent>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "space-around", my: 2 }}>
                <Skeleton variant="rounded" width={80} height={50} />
                <Skeleton variant="rounded" width={80} height={50} />
              </Box>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "space-around", my: 2 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">{pokemon!.height / 10} m</Typography>
                  <Typography variant="caption" color="text.secondary">ความสูง</Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">{pokemon!.weight / 10} kg</Typography>
                  <Typography variant="caption" color="text.secondary">น้ำหนัก</Typography>
                </Box>
              </Box>
            )}

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>วิวัฒนาการ</Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
                {[1, 2, 3].map((i) => <Skeleton key={i} variant="circular" width={64} height={64} />)}
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center",
                gap: 1, mb: 3, flexWrap: "wrap" }}>
                {evolution.map((evo, idx) => (
                  <Box key={evo.name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <a href={`/pokemon/${evo.name}`} style={{ textDecoration: "none" }}>
                      <Box sx={{ textAlign: "center", cursor: "pointer",
                        opacity: evo.name === pokemonname ? 1 : 0.5,
                        "&:hover": { opacity: 1 } }}>
                        <Avatar
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                          sx={{ width: 64, height: 64,
                            border: evo.name === pokemonname ? `3px solid ${bgColor}` : "none" }}
                        />
                        <Typography variant="caption" sx={{ textTransform: "capitalize" }}>
                          {evo.name}
                        </Typography>
                      </Box>
                    </a>
                    {idx < evolution.length - 1 && <Typography>→</Typography>}
                  </Box>
                ))}
              </Box>
            )}

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Base Stats</Typography>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={20} sx={{ mb: 1 }} />
                ))
              : pokemon?.stats.map((s) => (
                  <Box key={s.stat.name} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" sx={{ textTransform: "capitalize" }}>
                        {s.stat.name}
                      </Typography>
                      <Typography variant="caption" fontWeight="bold">{s.base_stat}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={(s.base_stat / 255) * 100}
                      sx={{ height: 8, borderRadius: 4,
                        "& .MuiLinearProgress-bar": { backgroundColor: bgColor } }}
                    />
                  </Box>
                ))}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}