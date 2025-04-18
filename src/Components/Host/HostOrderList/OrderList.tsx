import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../Apps/store';
import { hostOrderList } from '../../../Api/host';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import EmptyStateImage from '../../../../public/assets/images.jpg'; 

interface IOrder {
  _id: string;
  bikeId: string;
  amount: number;
  startDate: string;
  endDate: string;
  userId: string;
  status: string;
}

const UserOrderList = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user;
  const userId = userDetails.userId;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await hostOrderList(userId);

        if (response?.success) {
          setOrders(Array.isArray(response.data.order) ? response.data.order : []);
        }
      } catch (error: any) {
        toast.error(error.response?.message?.error || 'Failed to fetch orders');
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton animation="wave" height={30} /></TableCell>
        <TableCell><Skeleton animation="wave" height={30} /></TableCell>
        <TableCell><Skeleton animation="wave" height={30} /></TableCell>
        <TableCell><Skeleton animation="wave" height={30} /></TableCell>
        <TableCell><Skeleton animation="wave" height={30} /></TableCell>
        <TableCell><Skeleton animation="wave" height={30} width={70} /></TableCell>
      </TableRow>
    ));
  };

  const renderEmptyState = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 4,
      mt: 2
    }}>
      <img 
        src={EmptyStateImage} 
        alt="No orders found" 
        style={{ maxWidth: '200px', marginBottom: '24px', opacity: 0.7 }}
      />
      <Typography variant="h6" color="text.secondary">No Orders Found</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
        You don't have any orders yet. Orders will appear here once customers book your bikes.
      </Typography>
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => navigate('/host/dashboard')}
      >
        Return to Dashboard
      </Button>
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ShoppingBagIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" component="h1" fontWeight="bold">
          Order Management
        </Typography>
      </Box>
      
      {loading ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bike ID</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderSkeletons()}
            </TableBody>
          </Table>
        </TableContainer>
      ) : orders.length === 0 ? (
        renderEmptyState()
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                <TableCell>Bike ID</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>{order.bikeId}</TableCell>
                  <TableCell>{formatDate(order.startDate)}</TableCell>
                  <TableCell>{formatDate(order.endDate)}</TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">₹{order.amount}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/host/orders/${order._id}`)}
                      sx={{ 
                        borderRadius: 1.5,
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: 1
                        }
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default UserOrderList;