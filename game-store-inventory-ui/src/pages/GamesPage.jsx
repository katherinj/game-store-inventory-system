import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
  createGame,
  deleteGame,
  getAllGames,
  searchGames,
  updateGame,
} from "../api/gamesAPI";

export default function GamesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [searchField, setSearchField] = useState("studio");
  const [searchValue, setSearchValue] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const emptyForm = {
    title: "",
    description: "",
    esrbRating: "",
    studio: "",
    price: "",
    quantity: "",
  };
  const [form, setForm] = useState(emptyForm);

  async function loadAll() {
    setErr("");
    setLoading(true);
    try {
      const data = await getAllGames();
      setRows(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70 },
      { field: "title", headerName: "Title", flex: 1, minWidth: 160 },
      { field: "studio", headerName: "Studio", width: 140 },
      { field: "esrbRating", headerName: "ESRB", width: 90 },
      { field: "price", headerName: "Price", width: 110 },
      { field: "quantity", headerName: "Qty", width: 90 },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        minWidth: 220,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 130,
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={() => {
                setEditing(params.row);
                setForm({
                  title: params.row.title ?? "",
                  description: params.row.description ?? "",
                  esrbRating: params.row.esrbRating ?? "",
                  studio: params.row.studio ?? "",
                  price: params.row.price ?? "",
                  quantity: params.row.quantity ?? "",
                });
                setOpen(true);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={async () => {
                if (!confirm(`Delete "${params.row.title}"?`)) return;
                try {
                  await deleteGame(params.row.id);
                  await loadAll();
                } catch (e) {
                  setErr(e.message);
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ),
      },
    ],
    [],
  );

  async function runSearch() {
    setErr("");
    setLoading(true);
    try {
      const args =
        searchField === "studio"
          ? { studio: searchValue }
          : searchField === "title"
            ? { title: searchValue }
            : { esrb: searchValue };

      const data = await searchGames(args);
      setRows(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  async function submit() {
    setErr("");
    try {
      // Convert numeric fields
      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      };

      if (editing) {
        await updateGame(editing.id, payload);
      } else {
        await createGame(payload);
      }
      setOpen(false);
      await loadAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Game Store Admin
          </Typography>
          <Typography color="text.secondary">
            Search for games, consoles or T-Shirts, add new ones, or edit
            existing entries
          </Typography>
        </Box>

        {err && <Alert severity="error">{err}</Alert>}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            select
            label="Search by"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="studio">Studio</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="esrb">ESRB</MenuItem>
          </TextField>

          <TextField
            label="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ flex: 1, minWidth: 220 }}
          />

          <Button variant="contained" onClick={runSearch}>
            Search
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              setSearchValue("");
              loadAll();
            }}
          >
            Reset
          </Button>

          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={openCreate}
          >
            Add Game
          </Button>
        </Stack>

        <Box sx={{ height: 520, bgcolor: "background.paper" }}>
          {loading ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: "100%" }}
            >
              <CircularProgress />
            </Stack>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(r) => r.id}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
            />
          )}
        </Box>
      </Stack>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editing ? "Edit Game" : "Add Game"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <TextField
              label="Studio"
              value={form.studio}
              onChange={(e) => setForm({ ...form, studio: e.target.value })}
            />
            <TextField
              label="ESRB Rating"
              value={form.esrbRating}
              onChange={(e) => setForm({ ...form, esrbRating: e.target.value })}
            />
            <TextField
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <TextField
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submit}>
            {editing ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
