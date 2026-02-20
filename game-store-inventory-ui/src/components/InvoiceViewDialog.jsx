import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function money(x) {
  const n = Number(x);
  return Number.isNaN(n) ? String(x) : n.toFixed(2);
}

export default function InvoiceViewDialog({ open, onClose, invoice }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        Invoice #{invoice?.id ?? ""}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {!invoice ? null : (
          <Stack spacing={1.5}>
            <Typography variant="body2">
              <b>{invoice.name}</b>
              <br />
              {invoice.street}
              <br />
              {invoice.city}, {invoice.state} {invoice.zipcode}
            </Typography>

            <Divider />

            <Typography variant="subtitle2">Items</Typography>
            <Stack spacing={0.5}>
              {(invoice.items || []).map((it) => (
                <Stack
                  key={it.id}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography variant="body2">
                    {it.itemType} #{it.itemId} × {it.quantity}
                  </Typography>
                  <Typography variant="body2">
                    ${money(it.lineTotal)}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Divider />

            <Stack spacing={0.4}>
              <Row label="Subtotal" value={`$${money(invoice.subtotal)}`} />
              <Row label="Tax" value={`$${money(invoice.tax)}`} />
              <Row
                label="Processing Fee"
                value={`$${money(invoice.processingFee)}`}
              />
              <Row label="Total" value={`$${money(invoice.total)}`} bold />
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, bold = false }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 400 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 400 }}>
        {value}
      </Typography>
    </Stack>
  );
}
