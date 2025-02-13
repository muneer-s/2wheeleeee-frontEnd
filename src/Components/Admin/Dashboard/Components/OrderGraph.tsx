import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

interface IOrder {
    _id: string;
    bikeId: string;
    amount: number;
    startDate: string;
    endDate: string;
    userId: string;
    status: string;
    method: string;
}

interface OrderGraphProps {
    orders: IOrder[];
}

const OrderGraph: React.FC<OrderGraphProps> = ({ orders }) => {
    const [filter, setFilter] = useState("all");

    // ✅ Filter Orders Based on Status
    const filteredOrders = filter === "all" ? orders : orders.filter(order => order.status === filter);

    // ✅ Group Orders by Date for Bar Chart
    const ordersByDate: Record<string, number> = {};
    filteredOrders.forEach(order => {
        const date = new Date(order.startDate).toLocaleDateString();
        ordersByDate[date] = (ordersByDate[date] || 0) + 1;
    });

    const barChartData = Object.entries(ordersByDate).map(([date, count]) => ({
        date,
        count,
    }));

    // ✅ Count Order Status for Pie Chart
    const statusCounts: Record<string, number> = {};
    orders.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        value: count,
    }));

    const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div>
            <FormControl style={{ width: "200px", marginBottom: "20px", marginTop: "20px" }}>
                <InputLabel style={{ marginBottom: "2px" }}>Status Filter</InputLabel>
                <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Booked">Booked</MenuItem>
                    <MenuItem value="Return">Return</MenuItem>
                </Select>
            </FormControl>

            {/* ✅ Bar Chart: Orders by Date */}
            <h3>Orders Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

            {/* ✅ Pie Chart: Order Status */}
            <h3>Order Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={pieChartData} dataKey="value" nameKey="name" outerRadius={100} label>
                        {pieChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrderGraph;
