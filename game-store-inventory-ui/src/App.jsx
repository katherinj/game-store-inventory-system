import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Container } from "@mui/material";

import GamesPage from "./pages/GamesPage";
import TShirtsPage from "./pages/TShirtsPage";
import ConsolesPage from "./pages/ConsolesPage";

export default function App() {
  return (
    <BrowserRouter>
      {/* Top Navigation */}
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Button color="inherit" component={Link} to="/games">
            Games
          </Button>

          <Button color="inherit" component={Link} to="/tshirts">
            T-Shirts
          </Button>

          <Button color="inherit" component={Link} to="/consoles">
            Consoles
          </Button>
        </Toolbar>
      </AppBar>

      {/* Pages */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<GamesPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/tshirts" element={<TShirtsPage />} />
          <Route path="/consoles" element={<ConsolesPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
