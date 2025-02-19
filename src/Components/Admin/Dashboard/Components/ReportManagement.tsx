import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

interface IOrder {
  _id: string;
  bikeId: IBike;
  amount: number;
  startDate: string;
  endDate: string;
  userId: IUser;
  status: string;
}

interface ReportManagementProps {
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

const ReportManagement: React.FC<ReportManagementProps> = ({ orders }) => {
  const mostBookedBikes = useMemo(() => {
    const bikeCounts: Record<string, number> = {};

    orders.forEach(order => {
      bikeCounts[order.bikeId.modelName] = (bikeCounts[order.bikeId.modelName] || 0) + 1;
    });

    return Object.entries(bikeCounts)
      .map(([bikeId, count]) => ({ bikeId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [orders]);

  const mostBookedMonth = useMemo(() => {
    const monthCounts: Record<string, number> = {};

    orders.forEach(order => {
      const month = new Date(order.startDate).toLocaleString("default", { month: "long", year: "numeric" });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    const sortedMonths = Object.entries(monthCounts).sort((a, b) => b[1] - a[1]);

    return sortedMonths.length ? sortedMonths[0][0] : "No data available";
  }, [orders]);

  // Revenue Trend Over Time
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
    <div style={{marginTop:"20px" , marginBottom:'40px'}}>
      <h2 style={{fontWeight:"bold",fontSize:"30px" }}>📊 Report Management</h2>

      {/*  Most Booked 10 Bikes */}
      <h3 style={{marginTop:"20px" , fontWeight:"bold", fontSize:"20px" }}>🏍️ Most Booked 10 Bikes</h3>
      <TableContainer style={{background:'#ffebee'}} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bike</TableCell>
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
      <div className="bg-black h-10"></div>

      {/* Most Booked Month */}
      <h3 style={{marginTop:"30px" , fontWeight:"bold", fontSize:"20px"}}>📅 Most Booked Month</h3>
      <p style={{marginTop:"20px" , marginBottom:"20px"}}><strong>{mostBookedMonth}</strong></p>
      <div className="bg-red-50 h-10"></div>

      {/* Revenue Over Time (Line Chart) */}
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
