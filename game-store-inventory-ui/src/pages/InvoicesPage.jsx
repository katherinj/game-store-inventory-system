import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";

import PageHeader from "../components/PageHeader";
import InvoiceViewDialog from "../components/InvoiceViewDialog";
import { createInvoice, getInvoiceById, getInvoices } from "../api/invoicesAPI";
import { getAllGames } from "../api/gamesAPI";
import { getAllConsoles } from "../api/consolesAPI";
import { getAllTShirts } from "../api/tshirtsAPI";

const ITEM_TYPES = ["Game", "Console", "T-Shirt"];

export default function InvoicesPage() {
  const [tab, setTab] = useState(0);

  // Create states
  const [customer, setCustomer] = useState({
    name: "",
    street: "",
    city: "",
    state: "NJ",
    zipcode: "",
  });

  const [availableItems, setAvailableItems] = useState([]);
  const [itemDraft, setItemDraft] = useState({
    itemType: "Game",
    itemId: "",
    quantity: 1,
  });
  const [items, setItems] = useState([]);

  // History states
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyRows, setHistoryRows] = useState([]);
  const [nameQuery, setNameQuery] = useState("");
  const [stateQuery, setStateQuery] = useState("");

  // Shared
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // View dialog
  const [viewOpen, setViewOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);

  // load dropdown inventory when itemType changes
  useEffect(() => {
    async function loadInventory() {
      try {
        if (itemDraft.itemType === "Game")
          setAvailableItems(await getAllGames());
        else if (itemDraft.itemType === "Console")
          setAvailableItems(await getAllConsoles());
        else setAvailableItems(await getAllTShirts());
      } catch (e) {
        setErr(e?.message || "Failed to load inventory for dropdown");
      }
    }
    loadInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemDraft.itemType]);

  function reservedQtyInCart(itemType, itemId) {
    return items
      .filter((x) => x.itemType === itemType && x.itemId === itemId)
      .reduce((sum, x) => sum + Number(x.quantity || 0), 0);
  }

  async function loadHistory(params = {}) {
    setErr("");
    setHistoryLoading(true);
    try {
      const data = await getInvoices(params);
      setHistoryRows(data);
    } catch (e) {
      setErr(e?.message || "Failed to load invoices");
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  function addItem() {
    setErr("");
    setSuccessMsg("");

    const id = Number(itemDraft.itemId);
    const qty = Number(itemDraft.quantity);

    if (!itemDraft.itemType || !id || qty < 1) {
      setErr("Pick an item and quantity.");
      return;
    }

    const display = availableItems.find((x) => x.id === id);
    if (!display) {
      setErr("Selected item not found in inventory list.");
      return;
    }

    // assumes backend returns `quantity` in the inventory list
    const available = Number(display.quantity ?? 0);

    // include what’s already in the cart for this same item
    const alreadyReserved = reservedQtyInCart(itemDraft.itemType, id);

    if (alreadyReserved + qty > available) {
      setErr(
        `Not enough inventory for this item. Available: ${available}, already in cart: ${alreadyReserved}, requested: ${qty}.`,
      );
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        itemType: itemDraft.itemType,
        itemId: id,
        quantity: qty,
        label:
          itemDraft.itemType === "Game"
            ? display?.title
            : itemDraft.itemType === "Console"
              ? `${display?.manufacturer ?? ""} ${display?.model ?? ""}`.trim()
              : `${display?.color ?? ""} ${display?.size ?? ""}`.trim(),
        price: display?.price ?? null,
      },
    ]);

    setItemDraft((d) => ({ ...d, itemId: "", quantity: 1 }));
  }
  function removeItem(rowId) {
    setItems((prev) => prev.filter((x) => x.id !== rowId));
  }

  async function submitInvoice() {
    setErr("");
    setSuccessMsg("");

    if (items.length === 0) {
      setErr("Add at least one line item.");
      return;
    }

    for (const k of ["name", "street", "city", "state", "zipcode"]) {
      if (!String(customer[k]).trim()) {
        setErr(`Customer field "${k}" is required.`);
        return;
      }
    }

    const payload = {
      ...customer,
      items: items.map(({ itemType, itemId, quantity }) => ({
        itemType,
        itemId,
        quantity,
      })),
    };

    setLoading(true);
    try {
      const created = await createInvoice(payload);
      setSuccessMsg(`Invoice created: #${created.id}`);
      setItems([]);
      await loadHistory(); // refresh history list
    } catch (e) {
      setErr(e?.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  }

  async function openViewInvoice(id) {
    setErr("");
    try {
      const full = await getInvoiceById(id);
      setViewInvoice(full);
      setViewOpen(true);
    } catch (e) {
      setErr(e?.message || "Failed to load invoice");
    }
  }

  const cartColumns = useMemo(
    () => [
      { field: "itemType", headerName: "Type", width: 120 },
      { field: "label", headerName: "Item", flex: 1, minWidth: 160 },
      { field: "itemId", headerName: "ID", width: 90 },
      { field: "quantity", headerName: "Qty", width: 90 },
      {
        field: "__actions",
        headerName: "Actions",
        width: 140,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            color="error"
            size="small"
            onClick={() => removeItem(params.row.id)}
          >
            Remove
          </Button>
        ),
      },
    ],
    [],
  );

  const historyColumns = useMemo(
    () => [
      { field: "id", headerName: "Invoice #", width: 110 },
      { field: "name", headerName: "Customer", flex: 1, minWidth: 150 },
      { field: "state", headerName: "State", width: 90 },
      { field: "total", headerName: "Total", width: 110 },
      {
        field: "__view",
        headerName: "View",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => openViewInvoice(params.row.id)}
          >
            View
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <Stack spacing={2}>
      <PageHeader
        title="Invoices"
        subtitle="Create invoices + search/view invoice history (read-only)"
        actions={
          tab === 0 ? (
            <Button
              variant="contained"
              startIcon={<ReceiptLongIcon />}
              onClick={submitInvoice}
              disabled={loading}
            >
              Create Invoice
            </Button>
          ) : null
        }
      />

      {err && <Alert severity="error">{err}</Alert>}
      {successMsg && <Alert severity="success">{successMsg}</Alert>}

      <Paper sx={{ borderRadius: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, pt: 1 }}>
          <Tab label="Create Invoice" />
          <Tab label="Invoice History" />
        </Tabs>
        <Divider />

        {tab === 0 ? (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <Stack spacing={2}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Customer Info
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Name"
                            value={customer.name}
                            onChange={(e) =>
                              setCustomer((c) => ({
                                ...c,
                                name: e.target.value,
                              }))
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Street"
                            value={customer.street}
                            onChange={(e) =>
                              setCustomer((c) => ({
                                ...c,
                                street: e.target.value,
                              }))
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="City"
                            value={customer.city}
                            onChange={(e) =>
                              setCustomer((c) => ({
                                ...c,
                                city: e.target.value,
                              }))
                            }
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            fullWidth
                            label="State"
                            value={customer.state}
                            onChange={(e) =>
                              setCustomer((c) => ({
                                ...c,
                                state: e.target.value,
                              }))
                            }
                            inputProps={{ maxLength: 2 }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            fullWidth
                            label="Zip"
                            value={customer.zipcode}
                            onChange={(e) =>
                              setCustomer((c) => ({
                                ...c,
                                zipcode: e.target.value,
                              }))
                            }
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Add Line Item
                      </Typography>

                      <Stack spacing={2}>
                        <TextField
                          select
                          label="Item Type"
                          value={itemDraft.itemType}
                          onChange={(e) =>
                            setItemDraft((d) => ({
                              ...d,
                              itemType: e.target.value,
                            }))
                          }
                        >
                          {ITEM_TYPES.map((t) => (
                            <MenuItem key={t} value={t}>
                              {t}
                            </MenuItem>
                          ))}
                        </TextField>

                        <TextField
                          select
                          label="Select Item"
                          value={itemDraft.itemId}
                          onChange={(e) =>
                            setItemDraft((d) => ({
                              ...d,
                              itemId: e.target.value,
                            }))
                          }
                          helperText="Human-friendly selection (UI) → sends id (backend)"
                        >
                          {availableItems.map((x) => (
                            <MenuItem key={x.id} value={x.id}>
                              {itemDraft.itemType === "Game"
                                ? `${x.title} — $${x.price}`
                                : itemDraft.itemType === "Console"
                                  ? `${x.manufacturer} ${x.model} — $${x.price}`
                                  : `${x.color} ${x.size} — $${x.price}`}
                            </MenuItem>
                          ))}
                        </TextField>

                        <TextField
                          label="Quantity"
                          type="number"
                          value={itemDraft.quantity}
                          onChange={(e) =>
                            setItemDraft((d) => ({
                              ...d,
                              quantity: e.target.value,
                            }))
                          }
                          inputProps={{ min: 1 }}
                        />

                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={addItem}
                        >
                          Add Item
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>

              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Cart Items
                  </Typography>

                  <DataGrid
                    autoHeight
                    rows={items}
                    columns={cartColumns}
                    pageSizeOptions={[5, 10]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5, page: 0 } },
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Create invoice to decrement inventory + generate totals.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              spacing={2}
              useFlexGap
              flexWrap="wrap"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <TextField
                label="Search by customer name"
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                sx={{ flex: "1 1 260px", minWidth: 240 }}
              />
              <TextField
                label="Filter by state"
                value={stateQuery}
                onChange={(e) => setStateQuery(e.target.value)}
                inputProps={{ maxLength: 2 }}
                sx={{ width: 160 }}
              />

              <Button
                variant="contained"
                onClick={() =>
                  loadHistory({
                    name: nameQuery.trim(),
                    state: stateQuery.trim(),
                  })
                }
              >
                Search
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  setNameQuery("");
                  setStateQuery("");
                  loadHistory();
                }}
              >
                Reset
              </Button>
            </Stack>

            <DataGrid
              autoHeight
              rows={historyRows}
              columns={historyColumns}
              loading={historyLoading}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
            />
          </Box>
        )}
      </Paper>

      <InvoiceViewDialog
        open={viewOpen}
        invoice={viewInvoice}
        onClose={() => setViewOpen(false)}
      />
    </Stack>
  );
}
