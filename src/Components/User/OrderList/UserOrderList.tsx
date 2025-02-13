import React, { useEffect, useState } from 'react';
import { orderList } from '../../../Api/admin';
import toast from 'react-hot-toast';
import { TableRow, TableCell , Button } from '@mui/material';
import CustomTable from '../../../ReusableComponents/CustomTable';
import { useNavigate } from 'react-router-dom';
import { userOrderList } from '../../../Api/user';
import { useAppSelector } from '../../../Apps/store';


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
  const navigate = useNavigate();

  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user
  console.log(11111,userDetails)
  const userId = userDetails.userId

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await userOrderList(userId);
        console.log('User Fetched Orders:', response);

        if (response?.success) {
            console.log("Order Data Type:", typeof response.data.order);
            console.log("Is Array:", Array.isArray(response.data.order));
            setOrders(Array.isArray(response.data.order) ? response.data.order : []);
          } 
      } catch (error: any) {
        toast.error('Error fetching order list...');
        console.error('Error fetching orders:', error.message);
        setOrders([]);

      }
    };

    fetchOrders();
  }, []);

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
            </TableRow>
          )}
        />
      )}
    </div>
  );
};



export default UserOrderList


