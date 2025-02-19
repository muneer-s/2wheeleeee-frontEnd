import { useEffect, useState } from "react";
import { orderList } from "../../../Api/admin";
import toast from "react-hot-toast";
import OrderList from "./Components/OrderList";
import OrderGraph from "./Components/OrderGraph";
import ReportManagement from "./Components/ReportManagement";

interface IOrder {
  _id: string;
  bikeId: IBike;
  amount: number;
  startDate: string;
  endDate: string;
  userId: IUser;
  status: string;
  method: string;
}
interface IUser{
  _id:string
  name:string
}
interface IBike{
  _id:string,
  modelName:string
}

const Dashboard = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderList();
        console.log(33,response);

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

      <div className="bg-red-50">
      <OrderGraph orders={orders} />  {/*  Graphs */}
      <div className="bg-black h-10"></div>
      <ReportManagement orders={orders} />  {/*  Reports */}
      <div className="bg-black h-10"></div>
      <OrderList orders={orders} />  {/* Order Table */}
      </div>
    </>
  );
};

export default Dashboard;
