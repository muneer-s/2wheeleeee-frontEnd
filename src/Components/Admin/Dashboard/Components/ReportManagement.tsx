import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

interface IOrder {
  _id: string;
  bikeId: string;
  amount: number;
  startDate: string;
  endDate: string;
  userId: string;
  status: string;
}

interface ReportManagementProps {
  orders: IOrder[];
}

const ReportManagement: React.FC<ReportManagementProps> = ({ orders }) => {
  // ✅ 1️⃣ Most Booked 10 Bikes
  const mostBookedBikes = useMemo(() => {
    const bikeCounts: Record<string, number> = {};

    orders.forEach(order => {
      bikeCounts[order.bikeId] = (bikeCounts[order.bikeId] || 0) + 1;
    });

    return Object.entries(bikeCounts)
      .map(([bikeId, count]) => ({ bikeId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [orders]);

  // ✅ 2️⃣ Most Booked Month
  const mostBookedMonth = useMemo(() => {
    const monthCounts: Record<string, number> = {};

    orders.forEach(order => {
      const month = new Date(order.startDate).toLocaleString("default", { month: "long", year: "numeric" });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    const sortedMonths = Object.entries(monthCounts).sort((a, b) => b[1] - a[1]);

    return sortedMonths.length ? sortedMonths[0][0] : "No data available";
  }, [orders]);

  // ✅ 3️⃣ Revenue Trend Over Time
  const revenueByMonth = useMemo(() => {
    const revenueMap: Record<string, number> = {};

    orders.forEach(order => {
      const month = new Date(order.startDate).toLocaleString("default", { month: "short", year: "numeric" });
      revenueMap[month] = (revenueMap[month] || 0) + 150;
    });

    return Object.entries(revenueMap).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }, [orders]);

  return (
    <div>
      <h2>📊 Report Management</h2>

      {/* ✅ Most Booked 10 Bikes */}
      <h3>🏍️ Most Booked 10 Bikes</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bike ID</TableCell>
              <TableCell>Booking Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mostBookedBikes.map(({ bikeId, count }) => (
              <TableRow key={bikeId}>
                <TableCell>{bikeId}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Most Booked Month */}
      <h3>📅 Most Booked Month</h3>
      <p><strong>{mostBookedMonth}</strong></p>

      {/* ✅ Revenue Over Time (Line Chart) */}
      <h3>💰 Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={revenueByMonth}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportManagement;
