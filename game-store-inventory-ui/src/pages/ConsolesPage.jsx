import CrudTable from "../components/CrudTable";
import {
  createConsole,
  deleteConsole,
  getAllConsoles,
  searchConsoles,
  updateConsole,
} from "../api/consolesAPI";
import { Container } from "@mui/material";

export default function ConsolesPage() {
  const columns = [
    { field: "id", headerName: "ID", minWidth: 70, flex: 0.4 },
    { field: "model", headerName: "Model", minWidth: 170, flex: 1.2 },
    {
      field: "manufacturer",
      headerName: "Manufacturer",
      minWidth: 150,
      flex: 1,
    },
    { field: "memoryAmount", headerName: "Memory", minWidth: 120, flex: 0.8 },
    { field: "processor", headerName: "Processor", minWidth: 160, flex: 1 },
    { field: "price", headerName: "Price", minWidth: 110, flex: 0.7 },
    { field: "quantity", headerName: "Qty", minWidth: 90, flex: 0.6 },
    { field: "__actions", headerName: "Actions", minWidth: 160, flex: 0.9 },
  ];

  const fields = [
    { name: "model", label: "Model", required: true },
    { name: "manufacturer", label: "Manufacturer", required: true },
    { name: "memoryAmount", label: "Memory (optional)" },
    { name: "processor", label: "Processor (optional)" },
    { name: "price", label: "Price", type: "number", required: true },
    { name: "quantity", label: "Quantity", type: "number", required: true },
  ];

  const emptyForm = {
    model: "",
    manufacturer: "",
    memoryAmount: "",
    processor: "",
    price: "",
    quantity: "",
  };

  const searchOptions = [
    { value: "manufacturer", label: "Manufacturer" },
    { value: "model", label: "Model" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <CrudTable
        title="Consoles"
        subtitle="Console inventory management dashboard"
        columns={columns}
        fetchAll={getAllConsoles}
        createOne={createConsole}
        updateOne={updateConsole}
        deleteOne={deleteConsole}
        search={(q) => searchConsoles(q)}
        fields={fields}
        emptyForm={emptyForm}
        searchOptions={searchOptions}
      />
    </Container>
  );
}
