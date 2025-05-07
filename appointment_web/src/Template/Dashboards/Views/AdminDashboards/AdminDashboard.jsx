import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { TextField, Grid, Box, Typography, Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AdminHeader from "../../Components/AdminHeader/AdminHeader.jsx";

const AdminDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("Hostels");
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data
  const counters = [
    { label: "Total Revenue", value: "₹120,000" },
    { label: "Total Bookings", value: "3,200" },
    { label: "Daily Revenue", value: "₹3,200" },
    { label: "Monthly Revenue", value: "₹45,000" },
    { label: "Customer Satisfaction", value: "92%" },
    { label: "Pending Approvals", value: "120" },
  ];

  const barData = [
    { name: "Jan", revenue: 3000 },
    { name: "Feb", revenue: 4000 },
    { name: "Mar", revenue: 3200 },
    { name: "Apr", revenue: 5000 },
  ];

  const pieData = [
    { name: "Service A", value: 400 },
    { name: "Service B", value: 300 },
    { name: "Service C", value: 300 },
  ];

  const colors = ["#0088FE", "#00C49F", "#FFBB28"];

  const tableData = [
    { id: 1, category: "Hostels", revenue: "₹1,200", bookings: 12 },
    { id: 2, category: "Hospitals", revenue: "₹3,400", bookings: 30 },
    { id: 3, category: "Garages", revenue: "₹800", bookings: 8 },
  ];

  return (
    <React.Fragment>
    <Box sx={{display:"flex"}}>
      <AdminHeader/>
      {/* Header */}
      <Box  sx={{ flexGrow: 1, p: 3, py: 10 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          {/* <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
            sx={{ bgcolor: "#fff", borderRadius: 1 }}
          >
            <MenuItem value="Hostels">Hostels</MenuItem>
            <MenuItem value="Hospitals">Hospitals</MenuItem>
            <MenuItem value="Garages">Garages</MenuItem>
            <MenuItem value="Beauty & Tattoo">Beauty & Tattoo</MenuItem>
            <MenuItem value="Food Catering">Food Catering</MenuItem>
            <MenuItem value="Fashion Design">Fashion Design</MenuItem>
          </Select> */}
          <TextField
            placeholder="Search"
            size="small"
            InputProps={{ endAdornment: <SearchIcon /> }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>

      {/* Counters */}
      <Grid container spacing={2} mb={3}>
        {counters.map((counter, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {counter.label}
                </Typography>
                <Typography variant="h5" color="primary">
                  {counter.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={3}>
        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Revenue Trends
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Monthly Revenue
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Service Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-₹{index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Table */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        {/* <DateRangePicker
          startText="Start Date"
          endText="End Date"
          value={dateRange}
          onChange={(newValue) => setDateRange(newValue)}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} size="small" sx={{ mr: 2 }} />
              <TextField {...endProps} size="small" />
            </>
          )}
        /> */}
        <Button variant="contained" color="primary">
          Apply Filters
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Revenue</TableCell>
              <TableCell>Bookings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.revenue}</TableCell>
                <TableCell>{row.bookings}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    </Box>
    </React.Fragment>
  );
};

export default AdminDashboard;
