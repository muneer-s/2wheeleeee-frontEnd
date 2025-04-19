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
  _id: string;
  name: string;
}
interface IBike{
  _id: string;
  modelName: string;
}

const Dashboard = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderList();
        console.log(33, response);

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
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard 
              title="Total Orders"
              value={orders.length}
              bgColor="bg-blue-500"
            />
            <DashboardCard 
              title="Completed Orders"
              value={orders.filter(order => order.status === "Completed").length}
              bgColor="bg-green-500"
            />
            <DashboardCard 
              title="Booked Orders"
              value={orders.filter(order => order.status === "Booked").length}
              bgColor="bg-amber-500"
            />
          </div>
          
          {/* Graphs Section */}
          <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
            <OrderGraph orders={orders} />
          </div>
          
          {/* Reports Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <ReportManagement orders={orders} />
          </div>
          
          {/* Order Table Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <OrderList orders={orders} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, value, bgColor }: { title: string, value: number, bgColor: string }) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6 text-white`}>
      <h2 className="text-lg font-medium opacity-90">{title}</h2>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default Dashboard;