import { Box, Stack, Typography } from "@mui/material";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary">{subtitle}</Typography>
          )}
        </Box>

        {actions && <Box>{actions}</Box>}
      </Stack>
    </Box>
  );
}
