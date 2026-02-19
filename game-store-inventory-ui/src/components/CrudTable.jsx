import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import PageHeader from "./PageHeader";
import EntityFormDialog from "./EntityFormDialog";
import ConfirmDialog from "./ConfirmDialog.jsx";

export default function CrudTable({
  title,
  subtitle,
  columns,
  getRowId = (r) => r.id,

  fetchAll,
  createOne,
  updateOne,
  deleteOne,
  search,

  fields,
  emptyForm,

  enableSearch = true,
  searchOptions = [
    { value: "title", label: "Title" },
    { value: "studio", label: "Studio" },
    { value: "esrb", label: "ESRB" },
  ],
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [searchField, setSearchField] = useState(
    searchOptions[0]?.value ?? "title",
  );
  const [searchValue, setSearchValue] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [mutating, setMutating] = useState(false);

  async function loadAll() {
    setErr("");
    setLoading(true);
    try {
      const data = await fetchAll();
      setRows(data);
    } catch (e) {
      setErr(e?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enhancedColumns = useMemo(() => columns, [columns]);

  function openCreate() {
    setMode("create");
    setEditingRow(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(row) {
    setMode("edit");
    setEditingRow(row);

    const next = { ...emptyForm };
    for (const key of Object.keys(next)) next[key] = row[key] ?? next[key];
    setForm(next);

    setFormOpen(true);
  }

  async function submitForm() {
    setErr("");
    setMutating(true);
    try {
      if (mode === "edit") {
        await updateOne(editingRow.id, form);
      } else {
        await createOne(form);
      }
      setFormOpen(false);
      await loadAll();
    } catch (e) {
      setErr(e?.message || "Save failed");
    } finally {
      setMutating(false);
    }
  }

  function askDelete(row) {
    setDeleteTarget(row);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setErr("");
    setMutating(true);
    try {
      await deleteOne(deleteTarget.id);
      setConfirmOpen(false);
      setDeleteTarget(null);
      await loadAll();
    } catch (e) {
      setErr(e?.message || "Delete failed");
    } finally {
      setMutating(false);
    }
  }

  async function runSearch() {
    if (!search) return;
    setErr("");
    setLoading(true);
    try {
      const q = {};
      if (searchValue.trim()) q[searchField] = searchValue.trim();
      const data = Object.keys(q).length ? await search(q) : await fetchAll();
      setRows(data);
    } catch (e) {
      setErr(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  const headerActions = (
    <Stack direction="row" spacing={1}>
      <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}>
        Add
      </Button>
    </Stack>
  );

  return (
    <Stack spacing={2}>
      <PageHeader title={title} subtitle={subtitle} actions={headerActions} />

      {err && <Alert severity="error">{err}</Alert>}

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        {enableSearch && search && (
          <Stack
            direction="row"
            spacing={2}
            useFlexGap
            flexWrap="wrap"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <TextField
              select
              label="Search by"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              sx={{ minWidth: 180, flex: { xs: "1 1 180px", sm: "0 0 180px" } }}
            >
              {searchOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{ flex: "1 1 320px", minWidth: 240 }}
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
          </Stack>
        )}

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
              <CircularProgress />
            </Stack>
          ) : (
            <DataGrid
              autoHeight
              rows={rows}
              columns={enhancedColumns.map((c) => {
                if (c.field !== "__actions") return c;

                return {
                  ...c,
                  sortable: false,
                  filterable: false,
                  renderCell: (params) => (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Button size="small" onClick={() => openEdit(params.row)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => askDelete(params.row)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  ),
                };
              })}
              getRowId={getRowId}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              sx={{
                minWidth: 900, // forces horizontal scroll on tiny screens instead of crushing columns
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "background.paper",
                },
              }}
            />
          )}
        </Box>
      </Paper>

      <EntityFormDialog
        open={formOpen}
        mode={mode}
        title={mode === "edit" ? `Edit ${title}` : `Add ${title}`}
        fields={fields}
        value={form}
        loading={mutating}
        onChange={setForm}
        onClose={() => setFormOpen(false)}
        onSubmit={submitForm}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm delete"
        message={
          deleteTarget
            ? `Delete "${deleteTarget.title ?? deleteTarget.model ?? "item"}"?`
            : "Delete this item?"
        }
        confirmText="Delete"
        loading={mutating}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </Stack>
  );
}
