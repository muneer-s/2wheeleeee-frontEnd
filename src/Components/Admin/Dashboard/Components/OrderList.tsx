import { TableRow, TableCell } from "@mui/material";
import CustomTable from "../../../../ReusableComponents/CustomTable";

interface IOrder {
  _id: string;
  bikeId: string;
  amount: number;
  startDate: string;
  endDate: string;
  userId: string;
  status: string;
  method: string;
}

const OrderList: React.FC<{ orders: IOrder[] }> = ({ orders }) => {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
  const headers = ["Bike ID", "Start Date", "End Date", "Amount", "Status", "User ID", "Payment Method"];

  return (
    <div>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <CustomTable
          headers={headers}
          data={orders}
          renderRow={(order) => (
            <TableRow key={order._id}>
              <TableCell>{order.bikeId}</TableCell>
              <TableCell>{formatDate(order.startDate)}</TableCell>
              <TableCell>{formatDate(order.endDate)}</TableCell>
              <TableCell>₹{order.amount}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.userId}</TableCell>
              <TableCell>{order.method}</TableCell>
            </TableRow>
          )}
        />
      )}
    </div>
  );
};

export default OrderList;
