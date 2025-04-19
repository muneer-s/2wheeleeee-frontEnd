import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
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

interface IUser {
    _id: string;
    name: string;
}

interface IBike {
    _id: string;
    modelName: string;
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

    const COLORS = ["#4C51BF", "#38B2AC", "#F6AD55", "#F56565"];
    const RADIAN = Math.PI / 180;
    
    // Custom label for pie chart
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Order Analytics</h2>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="status-filter-label">Filter by Status</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        value={filter}
                        label="Filter by Status"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <MenuItem value="all">All Orders</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Booked">Booked</MenuItem>
                        <MenuItem value="Return">Return</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart: Orders by Date */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Orders Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                    border: 'none'
                                }}
                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            />
                            <Bar 
                                dataKey="count" 
                                fill="#4F46E5"
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart: Order Status */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Order Status Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={90}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {pieChartData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value, name) => [`${value} orders`, name]}
                                contentStyle={{ 
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                    border: 'none'
                                }}
                            />
                            <Legend 
                                layout="horizontal" 
                                verticalAlign="bottom" 
                                align="center"
                                wrapperStyle={{ paddingTop: '20px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default OrderGraph;