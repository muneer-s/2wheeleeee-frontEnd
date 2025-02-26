import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TableRow, TableCell, Button } from '@mui/material';
import CustomTable from '../../../ReusableComponents/CustomTable';
import { useNavigate } from 'react-router-dom';
import { userOrderList } from '../../../Api/user';
import { useAppSelector } from '../../../Apps/store';
import Api from '../../../service/axios';
import ChatUI from '../Chat/MainChatUI'


interface IOrder {
  _id: string;
  bikeId: string;
  amount: number;
  startDate: string;
  endDate: string;
  userId: string;
  status: string;
  ownerId: string
}
interface ProfilePageProps {
  socket: any;
}

const UserOrderList: React.FC<ProfilePageProps> = ({ socket }) => {

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hostId, setHostId] = useState("");
  const [chatId, setChatId] = useState("");
  const navigate = useNavigate();

  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user

  const userId = userDetails.userId

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await userOrderList(userId);

        if (response?.success) {
          setOrders(Array.isArray(response.data.order) ? response.data.order : []);
        }
      } catch (error: any) {
        toast.error('Error fetching order list...');
        console.error('Error fetching orders:', error.response.data.message);
        setOrders([]);

      }
    };

    fetchOrders();
  }, []);


  const buttonTrigger = (hostId: string) => {
    setHostId(hostId);
    Api
      .post("/chat/accesschat", { receiverId: hostId, senderId: userId })
      .then((res) => {
        console.log(13, res.data.data);

        if (res.data) {
          setChatId(res.data.data._id);
          setIsOpen(true);
        }
      });
  };


  const handleClose = () => {
    setIsOpen(false);
  };
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const headers = ['Order ID', 'Start Date', 'End Date', 'Amount', 'Status'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4"> Order List</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <CustomTable
          headers={headers}
          data={orders}
          renderRow={(order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{formatDate(order.startDate)}</TableCell>
              <TableCell>{formatDate(order.endDate)}</TableCell>
              <TableCell>₹{order.amount}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/user/orders/${order._id}`)}
                >
                  View
                </Button>
              </TableCell>



              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ fontSize: '0.6rem' }}
                  onClick={() =>
                    buttonTrigger(order.ownerId)
                  }
                >
                  Connect Host
                </Button>
              </TableCell>


            </TableRow>
          )}
        />
      )}



      {isOpen ? (
        <ChatUI
          isChatOpen={isOpen}
          onClose={handleClose}
          hostId={hostId}
          chatId={chatId}
          socket={socket}
        />
      ) : (
        ""
      )}
    </div>


  );
};



export default UserOrderList


