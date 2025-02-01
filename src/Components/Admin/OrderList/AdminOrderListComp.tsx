import React, { useEffect, useState } from 'react';
import { orderList } from '../../../Api/admin';
import toast from 'react-hot-toast';
import { TableRow, TableCell , Button } from '@mui/material';
import CustomTable from '../../../ReusableComponents/CustomTable';
import { useNavigate } from 'react-router-dom';


interface IOrder {
  _id: string;
  bikeId: string;
  amount: number;
  startDate: string;
  endDate: string;
  userId: string;
  status: string;
}

const AdminOrderListComp = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
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
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const headers = ['Order ID', 'Bike ID', 'Start Date', 'End Date', 'Amount', 'Status', 'User ID'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Order List</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <CustomTable
          headers={headers}
          data={orders}
          renderRow={(order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.bikeId}</TableCell>
              <TableCell>{formatDate(order.startDate)}</TableCell>
              <TableCell>{formatDate(order.endDate)}</TableCell>
              <TableCell>₹{order.amount}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.userId}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/admin/orders/${order._id}`)} // Navigate to details page
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

export default AdminOrderListComp;
