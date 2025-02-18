import { TableRow, TableCell } from "@mui/material";
import CustomTable from "../../../../ReusableComponents/CustomTable";

interface IOrder {
  _id: string;
  bikeId: IBike;
  amount: number;
  startDate: string;
  endDate: string;
  userId: string;
  status: string;
  method: string;
}

interface IBike{
  _id:string,
  modelName:string
}

const OrderList: React.FC<{ orders: IOrder[] }> = ({ orders }) => {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
  const headers = ["Bike ", "Start Date", "End Date", "Amount", "Status", "User ID", "Payment Method"];

  return (
    <div className="bg-red-50 p-4 rounded-lg">
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <h2 className="mb-4 font-bold text-2xl">Order List</h2>
          <div className="bg-red-50 p-2 rounded-lg">
            <CustomTable
              headers={headers}
              data={orders}
              renderRow={(order) => (
                <TableRow key={order._id} className="bg-red-50">
                  <TableCell>{order.bikeId.modelName}</TableCell>
                  <TableCell>{formatDate(order.startDate)}</TableCell>
                  <TableCell>{formatDate(order.endDate)}</TableCell>
                  <TableCell>₹{order.amount}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>{order.method}</TableCell>
                </TableRow>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OrderList;
