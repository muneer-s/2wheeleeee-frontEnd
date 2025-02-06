import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TableRow, TableCell , Button } from '@mui/material';
import CustomTable from '../../../ReusableComponents/CustomTable';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../Apps/store';
import { hostOrderList } from '../../../Api/host';


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
  const userId = userDetails.userId

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await hostOrderList(userId);

        if (response?.success) {
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

  const headers = ['Order ID', 'Bike ID', 'Start Date', 'End Date', 'Amount', 'Status'];

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
              <TableCell>{order.bikeId}</TableCell>
              <TableCell>{formatDate(order.startDate)}</TableCell>
              <TableCell>{formatDate(order.endDate)}</TableCell>
              <TableCell>₹{order.amount}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/host/orders/${order._id}`)}
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


