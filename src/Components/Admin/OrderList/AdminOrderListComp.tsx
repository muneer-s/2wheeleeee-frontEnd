import { useEffect, useState } from 'react';
import { orderList } from '../../../Api/admin';
import toast from 'react-hot-toast';
import { TableRow, TableCell, Button, Paper, Typography, Box, Chip } from '@mui/material';
import CustomTable from '../../../ReusableComponents/CustomTable';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Receipt, ShoppingBag } from '@mui/icons-material';

interface Bike {
  _id: string;
  modelName: string;
}

interface User {
  _id: string;
  name: string;
}

interface IOrder {
  _id: string;
  bikeId: Bike;
  amount: number;
  startDate: string;
  endDate: string;
  userId: User;
  status: string;
}

const AdminOrderListComp = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await orderList();
        console.log('Fetched Orders:', response);

        if (response?.success) {
          setOrders(response.data.order);
        } else {
          toast.error('Failed to load order list');
        }
      } catch (error: any) {
        toast.error('Error fetching order list...');
        console.error('Error fetching orders:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.bikeId.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headers = ['Order ID', 'Bike', 'Rental Period', 'Amount', 'Status', 'Customer', 'Actions'];

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(120deg, #2c3e50, #4c669f)', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Receipt sx={{ fontSize: 36, mr: 2 }} />
            <div>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Order Management
              </Typography>
              <Typography variant="subtitle1">
                View and manage all customer rental orders
              </Typography>
            </div>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`${orders.length} Total Orders`} 
              color="primary" 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                fontWeight: 'medium'
              }} 
            />
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3, 
            backgroundColor: '#f5f7fa', 
            borderRadius: 2,
            p: 1
          }}>
            <Search sx={{ color: '#64748b', mx: 1 }} />
            <input
              type="text"
              placeholder="Search by order ID, bike model, customer name or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 bg-transparent border-none outline-none text-gray-700"
            />
          </Box>

          {loading ? (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <div className="animate-pulse flex flex-col items-center">
                <ShoppingBag sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                <Typography color="textSecondary">Loading orders...</Typography>
              </div>
            </Box>
          ) : filteredOrders.length === 0 ? (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <ShoppingBag sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No orders found
              </Typography>
              <Typography color="textSecondary">
                {searchTerm ? 'Try adjusting your search criteria' : 'Orders will appear here once created'}
              </Typography>
            </Box>
          ) : (
            <Paper elevation={0} sx={{ 
              borderRadius: 2, 
              overflow: 'hidden', 
              border: '1px solid #e2e8f0' 
            }}>
              <CustomTable
                headers={headers}
                data={filteredOrders}
                renderRow={(order) => (
                  <TableRow 
                    key={order._id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: '#f8fafc' 
                      },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium', color: '#334155' }}>
                      {order._id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: '50%', 
                            backgroundColor: '#e2e8f0', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mr: 1.5
                          }}
                        >
                          <ShoppingBag sx={{ fontSize: 18, color: '#64748b' }} />
                        </Box>
                        <Typography variant="body2" fontWeight="medium">
                          {order.bikeId.modelName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
                          FROM
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatDate(order.startDate)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" fontSize="0.75rem" mt={1}>
                          TO
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatDate(order.endDate)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="#334155">
                        ₹{order.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        color={getStatusColor(order.status) as "success" | "warning" | "error" | "info" | "default"}
                        size="small"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {order.userId.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        endIcon={<ArrowRight />}
                        sx={{ 
                          textTransform: 'none', 
                          borderRadius: 2,
                          boxShadow: 'none',
                          '&:hover': {
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              />
            </Paper>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminOrderListComp;