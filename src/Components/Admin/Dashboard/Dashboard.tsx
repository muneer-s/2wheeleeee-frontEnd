import { useEffect, useState } from "react";
import { orderList } from "../../../Api/admin";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OrderList from "./Components/OrderList";
import OrderGraph from "./Components/OrderGraph";
import ReportManagement from "./Components/ReportManagement";

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

const Dashboard = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderList();

        if (response?.success) {
          setOrders(response.data.order);
        }
      } catch (error: any) {
        toast.error("Error fetching order list...");
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <div></div>

      <div>
      <OrderGraph orders={orders} />  {/* 📊 Graphs */}
      <ReportManagement orders={orders} />  {/* 📋 Reports */}
      <OrderList orders={orders} />  {/* 📝 Order Table */}
      </div>
    </>
  );
};

export default Dashboard;
