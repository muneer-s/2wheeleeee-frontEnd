import { useNavigate } from 'react-router-dom';
import hostHome1 from '../../../assets/hostHome1.png';
import hostHome2 from '../../../assets/hostHome2.png';
import hostHome3 from '../../../assets/hostHome3.png';
import { useAppSelector } from '../../../Apps/store';
import { isAdminVerifyUser } from '../../../Api/host';

function Body() {
  const navigate = useNavigate()

  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user
  const userId = userDetails.userId

  const gotoRegisterPage = async () => {
    const response = await isAdminVerifyUser(userId)

    if (response?.data?.user?.isUser) {
      navigate('/hostBikeListPage')
    } else {
      navigate('/hostWaitingPage')
      console.log('Admin verification failed');
    }
  }

  return (
    <>
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(to bottom, white, #AEECFF)",
        }}
      >
        <div className="flex flex-col-reverse md:flex-row justify-between items-center my-10 px-4 md:px-20">
          
          <div className='text-center md:text-left lg:w-2/3'>
            <h1 className="text-2xl md:text-4xl font-bold mb-4">Feel Free To Host With Us!</h1>
            <p className="text-gray-600 mb-6 ">
              2Wheeleeee makes it easy for you to earn extra income by renting out your bike to trusted drivers. Simply list your asset, set your availability, and watch as your vehicle works for you. With our seamless process, you can manage your bookings and communicate with renters all in one place. Join our community of bike hosts today and start earning from your bike with minimal effort!
            </p>
            <button onClick={gotoRegisterPage} className="bg-sky-500  text-white px-4 py-2 rounded hover:bg-sky-600"
            >Get Started</button>
          </div>

          <div className="mb-6 md:mb-0">
            <img src={hostHome1} alt="Hosting illustration" className='w-full lg:w-80 md:w-72 lg:h-64 max-w-md mx-auto' />
          </div>
        </div>


        <div className="flex flex-col md:flex-row-reverse justify-between items-center  my-10 px-4 md:px-20 ">

          <div className="text-center md:text-left lg:w-2/3">
            <h1 className="text-2xl md:text-4xl font-bold mb-4">Flexible Scheduling</h1>
            <p className="text-gray-600 ">
              2Wheeleeee empowers you with complete control over your vehicle’s availability through a flexible
              scheduling system. Specify the days and times your bike is available for rent.
            </p>
          </div>


          <div className="mb-6 md:mb-0  lg:w-1/3">
            <img src={hostHome2} alt="Scheduling illustration" className="w-full lg:w-80 max-w-md mx-auto" />
          </div>

        </div>


        <div className="flex flex-col md:flex-row justify-between items-center my-10 px-4 md:px-20">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold mb-4">Comprehensive Security Deposit</h1>
            <p className="text-gray-600">
              2Wheeleeee provides comprehensive security deposit for your vehicle during rental periods, ensuring
              peace of mind for both hosts and renters.
            </p>
          </div>
          <div className="mb-6 md:mb-0">
            <img src={hostHome3} alt="Security deposit illustration" className="w-full max-w-md mx-auto" />
          </div>
        </div>


      </div>
    </>
  );
}

export default Body;
