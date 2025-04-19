import { TableRow, TableCell, Chip, Box, Typography } from "@mui/material";
import CustomTable from "../../../../ReusableComponents/CustomTable";

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

interface IBike {
  _id: string,
  modelName: string
}

interface IUser {
  _id: string
  name: string
}

const OrderList: React.FC<{ orders: IOrder[] }> = ({ orders }) => {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
  
  const headers = ["Bike Model", "Booking Period", "Amount", "Status", "Customer", "Payment"];

  // Helper function to get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return {
          bg: '#DEF7EC',
          text: '#046C4E'
        };
      case 'Booked':
        return {
          bg: '#E1EFFE',
          text: '#1E429F'
        };
      case 'Return':
        return {
          bg: '#FEF3C7',
          text: '#92400E'
        };
      default:
        return {
          bg: '#F3F4F6',
          text: '#374151'
        };
    }
  };

  // Helper function to get payment method chip color
  const getPaymentColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card':
        return {
          bg: '#FCE7F3',
          text: '#9D174D'
        };
      case 'online':
        return {
          bg: '#E0E7FF',
          text: '#3730A3'
        };
      case 'cash':
        return {
          bg: '#D1FAE5',
          text: '#065F46'
        };
      default:
        return {
          bg: '#F3F4F6',
          text: '#374151'
        };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {orders.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 6
        }}>
          <span className="material-icons" style={{ fontSize: '48px', color: '#9CA3AF', marginBottom: '16px' }}>
            inbox
          </span>
          <Typography variant="h6" sx={{ color: '#4B5563', fontWeight: 500 }}>
            No orders found
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', mt: 1 }}>
            Order data will appear here once customers make bookings
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              color: '#1F2937',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <span className="material-icons">list_alt</span>
              Order History
            </Typography>
            <Chip 
              label={`${orders.length} Orders`} 
              sx={{ 
                backgroundColor: '#EEF2FF', 
                color: '#4F46E5',
                fontWeight: 500
              }} 
            />
          </Box>
          
          <Box sx={{ 
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <CustomTable
              headers={headers}
              data={orders}
              renderRow={(order) => (
                <TableRow 
                  key={order._id}
                  sx={{ 
                    '&:hover': { backgroundColor: '#F9FAFB' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>
                    {order.bikeId.modelName}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" sx={{ color: '#4B5563' }}>
                        {formatDate(order.startDate)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                        to {formatDate(order.endDate)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1F2937' }}>
                    ₹{order.amount}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      size="small"
                      sx={{ 
                        backgroundColor: getStatusColor(order.status).bg, 
                        color: getStatusColor(order.status).text,
                        fontWeight: 500,
                        minWidth: '90px'
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    {order.userId.name}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.method} 
                      size="small"
                      sx={{ 
                        backgroundColor: getPaymentColor(order.method).bg, 
                        color: getPaymentColor(order.method).text,
                        fontWeight: 500
                      }} 
                    />
                  </TableCell>
                </TableRow>
              )}
            />
          </Box>
        </>
      )}
    </div>
  );
};

export default OrderList;