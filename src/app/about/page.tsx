import { Container, Typography, Card, CardContent, Box, Button, Divider } from "@mui/material";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card>
          <Box sx={{ background: "linear-gradient(135deg, #C62828, #E53935)", py: 4, textAlign: "center" }}>
            <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>👨‍💻 About This Project</Typography>
          </Box>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}>
            <Box>
              <Typography variant="overline" color="text.secondary">ผู้พัฒนา</Typography>
              <Typography variant="h6" fontWeight="bold">Dr.Pharada Sawangpaisankul</Typography>
              <Typography color="text.secondary">รหัสนักศึกษา: 673450198-8</Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="overline" color="text.secondary">รายวิชา</Typography>
              <Typography variant="h6" fontWeight="bold">Front-end Web Programming</Typography>
              <Typography color="text.secondary">รหัสวิชา: IN403101</Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="overline" color="text.secondary">หลักสูตร / มหาวิทยาลัย</Typography>
              <Typography variant="h6" fontWeight="bold">วิทยาการคอมพิวเตอร์ และ สารสนเทศ</Typography>
              <Typography color="text.secondary">มหาวิทยาลัยขอนแก่น วิทยาเขต หนองคาย</Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="overline" color="text.secondary">เทคโนโลยีที่ใช้</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {["Next.js", "React", "TypeScript", "MUI", "PokeAPI"].map((tech) => (
                  <Box key={tech} sx={{
                    backgroundColor: "#E53935", color: "white",
                    px: 1.5, py: 0.5, borderRadius: 10, fontSize: 13,
                  }}>
                    {tech}
                  </Box>
                ))}
              </Box>
            </Box>
            <Divider />
            <Button variant="contained"
              href="https://github.com/YOUR_USERNAME/YOUR_REPO"
              target="_blank"
              sx={{ backgroundColor: "#24292e", "&:hover": { backgroundColor: "#444" } }}>
              🐙 GitHub Source Code
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}