import React, { useEffect, useState } from 'react';
import { TableRow, TableCell, Button, Chip, Box, Typography, Paper } from '@mui/material';
import CustomTable from '../../../ReusableComponents/CustomTable';
import { useNavigate } from 'react-router-dom';
import { userOrderList } from '../../../Api/user';
import { useAppSelector } from '../../../Apps/store';
import Api from '../../../service/axios';
import ChatUI from '../Chat/MainChatUI';
import { CalendarToday, AttachMoney, Chat } from '@mui/icons-material';

interface IOrder {
  _id: string;
  bikeId: string;
  amount: number;
  startDate: string;
  endDate: string;
  userId: string;
  status: string;
  ownerId: string;
}

interface ProfilePageProps {
  socket: any;
}

const UserOrderList: React.FC<ProfilePageProps> = ({ socket }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [hostId, setHostId] = useState("");
  const [chatId, setChatId] = useState("");
  const navigate = useNavigate();

  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user;
  const userId = userDetails.userId;

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await userOrderList(userId);

        if (response?.success) {
          setOrders(Array.isArray(response.data.order) ? response.data.order : []);
        }
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const buttonTrigger = (hostId: string) => {
    setHostId(hostId);
    Api
      .post("/chat/accesschat", { receiverId: hostId, senderId: userId })
      .then((res) => {
        if (res.data) {
          setChatId(res.data.data._id);
          setIsOpen(true);
        }
      });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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

  const headers = ['Rental Period', 'Amount', 'Status', 'Actions'];

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          My Bike Rentals
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading your orders...</Typography>
        </Box>
      ) : orders.length === 0 ? (
        <Box sx={{ 
          p: 6, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          bgcolor: 'rgba(0,0,0,0.02)',
          borderRadius: 2
        }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            You don't have any orders yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/bikes')}
            sx={{ mt: 2 }}
          >
            Browse Bikes
          </Button>
        </Box>
      ) : (
        <CustomTable
          headers={headers}
          data={orders}
          renderRow={(order) => (
            <TableRow 
              key={order._id}
              sx={{ 
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                transition: 'background-color 0.3s'
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {formatDate(order.startDate)} - {formatDate(order.endDate)}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney fontSize="small" sx={{ color: 'success.main' }} />
                  <Typography fontWeight="medium">
                    {order.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </Typography>
                </Box>
              </TableCell>
              
              <TableCell>
                <Chip 
                  label={order.status} 
                  color={getStatusColor(order.status) as any}
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/user/orders/${order._id}`)}
                    sx={{ 
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 'medium'
                    }}
                  >
                    View Details
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<Chat fontSize="small" />}
                    onClick={() => buttonTrigger(order.ownerId)}
                    sx={{ 
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 'medium'
                    }}
                  >
                    Chat with Host
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          )}
        />
      )}

      {isOpen && (
        <ChatUI
          isChatOpen={isOpen}
          onClose={handleClose}
          hostId={hostId}
          chatId={chatId}
          socket={socket}
        />
      )}
    </Paper>
  );
};

export default UserOrderList;