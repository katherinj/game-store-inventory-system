import CrudTable from "../components/CrudTable";
import {
  createTShirt,
  deleteTShirt,
  getAllTShirts,
  searchTShirts,
  updateTShirt,
} from "../api/tshirtsAPI";
import { Container } from "@mui/material";

export default function TShirtsPage() {
  const columns = [
    { field: "id", headerName: "ID", minWidth: 70, flex: 0.4 },
    { field: "size", headerName: "Size", minWidth: 90, flex: 0.6 },
    { field: "color", headerName: "Color", minWidth: 120, flex: 1 },
    { field: "price", headerName: "Price", minWidth: 110, flex: 0.7 },
    { field: "quantity", headerName: "Qty", minWidth: 90, flex: 0.6 },
    {
      field: "description",
      headerName: "Description",
      minWidth: 240,
      flex: 1.6,
    },
    { field: "__actions", headerName: "Actions", minWidth: 160, flex: 0.9 },
  ];

  const fields = [
    { name: "size", label: "Size (XS/S/M/L/XL)", required: true },
    { name: "color", label: "Color", required: true },
    {
      name: "description",
      label: "Description",
      required: true,
      multiline: true,
      rows: 3,
    },
    { name: "price", label: "Price", type: "number", required: true },
    { name: "quantity", label: "Quantity", type: "number", required: true },
  ];

  const emptyForm = {
    size: "",
    color: "",
    description: "",
    price: "",
    quantity: "",
  };

  const searchOptions = [
    { value: "color", label: "Color" },
    { value: "size", label: "Size" },
    { value: "description", label: "Description" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <CrudTable
        title="T-Shirts"
        subtitle="T-shirt inventory management dashboard"
        columns={columns}
        fetchAll={getAllTShirts}
        createOne={createTShirt}
        updateOne={updateTShirt}
        deleteOne={deleteTShirt}
        search={(q) => searchTShirts(q)}
        fields={fields}
        emptyForm={emptyForm}
        searchOptions={searchOptions}
      />
    </Container>
  );
}
