import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

function normalizeValue(type, value) {
  if (type === "number") {
    if (value === "") return "";
    const n = Number(value);
    return Number.isNaN(n) ? "" : n;
  }
  return value;
}

export default function EntityFormDialog({
  open,
  mode = "create",
  title,
  fields = [],
  value = {},
  loading = false,
  onChange,
  onClose,
  onSubmit,
  submitText,
}) {
  const dialogTitle = title ?? (mode === "edit" ? "Edit" : "Add");
  const primaryText = submitText ?? (mode === "edit" ? "Save" : "Create");

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {fields.map((f) => {
            const v = value[f.name] ?? (f.type === "number" ? "" : "");
            const commonProps = {
              key: f.name,
              label: f.label,
              value: v,
              required: !!f.required,
              disabled: loading || !!f.disabled,
              helperText: f.helperText,
              fullWidth: true,
              onChange: (e) => {
                const next = normalizeValue(f.type, e.target.value);
                onChange({ ...value, [f.name]: next });
              },
            };

            if (f.select) {
              return (
                <TextField select {...commonProps}>
                  {(f.options ?? []).map((opt) => (
                    <MenuItem
                      key={String(opt.value ?? opt)}
                      value={opt.value ?? opt}
                    >
                      {opt.label ?? opt}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }

            return <TextField type={f.type ?? "text"} {...commonProps} />;
          })}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={loading}>
          {primaryText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
