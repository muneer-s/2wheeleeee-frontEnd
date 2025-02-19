import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

interface IOrder {
    _id: string;
    bikeId: IBike;
    amount: number;
    startDate: string;
    endDate: string;
    userId: IUser;
    status: string;
    method: string;
}

interface OrderGraphProps {
    orders: IOrder[];
}


interface IUser{
    _id:string
    name:string
  }

interface IBike{
    _id:string,
    modelName:string
  }

const OrderGraph: React.FC<OrderGraphProps> = ({ orders }) => {
    const [filter, setFilter] = useState("all");

    const filteredOrders = filter === "all" ? orders : orders.filter(order => order.status === filter);

    const ordersByDate: Record<string, number> = {};
    filteredOrders.forEach(order => {
        const date = new Date(order.startDate).toLocaleDateString();
        ordersByDate[date] = (ordersByDate[date] || 0) + 1;
    });

    const barChartData = Object.entries(ordersByDate).map(([date, count]) => ({
        date,
        count,
    }));

    // count Order Status for Pie Chart
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
        <div >
            <FormControl style={{ width: "220px", marginBottom: "20px", marginTop: "30px" }}>
                <InputLabel style={{ marginBottom: "2px" ,color:"black",fontWeight: "bold", fontSize: "26px" }}>Status Filter</InputLabel>
                <Select style={{marginTop:'14px'}} value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Booked">Booked</MenuItem>
                    <MenuItem value="Return">Return</MenuItem>
                </Select>
            </FormControl>

            {/*  Bar Chart: Orders by Date */}
            <h3 style={{background:'#ffebee',marginTop:"20px", fontWeight: "bold", fontSize: "26px"}}>Orders Over Time</h3>
            <ResponsiveContainer width="100%" height={300} style={{background:'#ffebee',marginBottom:"20px"}}>
                <BarChart data={barChartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            <div className="bg-black h-10"></div>

            {/*  Pie Chart: Order Status */}
            <h3 style={{background:'#ffebee',marginTop:"20px", fontWeight:"bold", fontSize:"26px"}} >Order Status Breakdown</h3>
            <ResponsiveContainer style={{background:'#ffebee'}} width="100%" height={300}>
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
