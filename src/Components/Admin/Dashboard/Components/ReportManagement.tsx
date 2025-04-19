import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Chip } from "@mui/material";

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

interface IUser {
  _id: string;
  name: string;
}

interface IBike {
  _id: string;
  modelName: string;
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <Typography variant="h4" component="h2" sx={{ 
        fontWeight: 700, 
        mb: 4,
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <span className="material-icons">insights</span>
        Business Reports
      </Typography>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Booked Bikes Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#4B5563'
          }}>
            <span className="material-icons">two_wheeler</span>
            Top Booked Bikes
          </Typography>
          
          <TableContainer component={Paper} elevation={0} sx={{ 
            backgroundColor: '#fafafa',
            border: '1px solid #f0f0f0',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Bike Model</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Bookings</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mostBookedBikes.map(({ bikeId, count }, index) => (
                  <TableRow key={bikeId} sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                    '&:hover': { backgroundColor: '#f0f7ff' }
                  }}>
                    <TableCell sx={{ width: '10%' }}>
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small"
                        sx={{ 
                          backgroundColor: index < 3 ? '#4F46E5' : '#E5E7EB', 
                          color: index < 3 ? 'white' : '#4B5563',
                          fontWeight: 600
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{bikeId}</TableCell>
                    <TableCell>
                      <Chip 
                        label={count} 
                        size="small"
                        sx={{ backgroundColor: '#E5E7EB', fontWeight: 500 }} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Revenue Chart Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#4B5563'
          }}>
            <span className="material-icons">payments</span>
            Revenue Trend
          </Typography>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByMonth} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }} 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  border: 'none'
                }}
                formatter={(value) => [`₹${value}`, 'Revenue']}
              />
              <Bar 
                dataKey="revenue" 
                fill="#4F46E5" 
                radius={[4, 4, 0, 0]}
                barSize={30}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most Booked Month */}
      <Box sx={{ 
        mt: 6, 
        p: 4, 
        backgroundColor: '#EEF2FF',
        borderRadius: '8px',
        border: '1px solid #E0E7FF',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <span className="material-icons" style={{ fontSize: '32px', color: '#4F46E5' }}>event_available</span>
        <div>
          <Typography variant="subtitle2" sx={{ color: '#4B5563', mb: 0.5 }}>
            Peak Booking Period
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937' }}>
            {mostBookedMonth}
          </Typography>
        </div>
      </Box>
    </div>
  );
};

export default ReportManagement;