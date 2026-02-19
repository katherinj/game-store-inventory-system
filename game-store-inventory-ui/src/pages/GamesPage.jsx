import CrudTable from "../components/CrudTable";
import {
  createGame,
  deleteGame,
  getAllGames,
  searchGames,
  updateGame,
} from "../api/gamesAPI";
import { Container, Box } from "@mui/material";

export default function GamesPage() {
  const columns = [
    { field: "id", headerName: "ID", minWidth: 70, flex: 0.4 },
    { field: "title", headerName: "Title", minWidth: 160, flex: 1.2 },
    { field: "studio", headerName: "Studio", minWidth: 140, flex: 1 },
    { field: "esrbRating", headerName: "ESRB", minWidth: 90, flex: 0.6 },
    { field: "price", headerName: "Price", minWidth: 110, flex: 0.7 },
    { field: "quantity", headerName: "Qty", minWidth: 90, flex: 0.6 },
    {
      field: "description",
      headerName: "Description",
      minWidth: 220,
      flex: 1.6,
    },
    { field: "__actions", headerName: "Actions", minWidth: 160, flex: 0.9 },
  ];

  const fields = [
    { name: "title", label: "Title", required: true },
    { name: "description", label: "Description", required: true },
    { name: "studio", label: "Studio", required: true },
    { name: "esrbRating", label: "ESRB Rating", required: true },
    { name: "price", label: "Price", type: "number", required: true },
    { name: "quantity", label: "Quantity", type: "number", required: true },
  ];

  const emptyForm = {
    title: "",
    description: "",
    studio: "",
    esrbRating: "",
    price: "",
    quantity: "",
  };

  return (
    <Box sx={{ width: "100%", py: 4 }}>
      <Container maxWidth="lg">
        <CrudTable
          title="Games"
          subtitle="Game inventory management dashboard"
          columns={columns}
          fetchAll={getAllGames}
          createOne={createGame}
          updateOne={updateGame}
          deleteOne={deleteGame}
          search={(q) => searchGames(q)}
          fields={fields}
          emptyForm={emptyForm}
        />
      </Container>
    </Box>
  );
}
