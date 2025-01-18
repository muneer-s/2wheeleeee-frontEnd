import { useNavigate } from 'react-router-dom';
import hostHome1 from '../../../assets/hostHome1.png';
import hostHome2 from '../../../assets/hostHome2.png';
import hostHome3 from '../../../assets/hostHome3.png';
import { AppDispatch, useAppSelector } from '../../../app/store';
import { useDispatch } from 'react-redux';
import { isAdminVerifyUser } from '../../../api/host';

function Body() {
  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>()
  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user
  console.log(1, userDetails.userId);
  const userId = userDetails.userId



  const gotoRegisterPage = async () => {
    const response = await isAdminVerifyUser(userId)
    console.log(9, response);

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
        <div className="flex justify-between items-center my-40 px-40">
          <div className='ml-1'>
            <h1 className="text-4xl font-bold mb-4">Feel Free To Host With Us!</h1>
            <p className="text-gray-600 mb-6 w-auto text-center">
              2Wheeleeee makes it easy for you to earn extra income by renting out your bike to trusted drivers. Simply list your asset, set your availability, and watch as your vehicle works for you. With our seamless process, you can manage your bookings and communicate with renters all in one place. Join our community of bike hosts today and start earning from your bike with minimal effort!
            </p>
            <button onClick={gotoRegisterPage} style={{ backgroundColor: '#049FD7' }} className=" text-white px-4 py-2 rounded">Get Started</button>
          </div>
          <div className="mr-1">
            <img src={hostHome1} alt="Hosting illustration" className='max-w-screen-sm' />
          </div>
        </div>


        <div className="flex justify-between items-center my-40 px-40">
          <div className='ml-1'>
            <img className='w-96' src={hostHome2} alt="Flexible scheduling illustration" />
          </div>
          <div className='mr-1 w-1/2'>
            <h1 className="text-4xl font-bold mb-4">Flexible Scheduling</h1>
            <p className="text-gray-600 w-auto text-center">
              2Wheeleeee empowers you with complete control over your vehicle’s availability through a flexible scheduling system. You can specify the days and times your bike is available for rent, accommodating your personal needs and preferences. Whether you prefer to rent out your vehicle during weekdays, weekends, or only on specific dates, our platform adapts to your schedule. This flexibility ensures that your bike is earning money when it's convenient for you, without interfering with your own use. Enjoy the freedom to maximize your earnings on your terms.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mx-30 my-30 px-40">
          <div className='w-1/2 text-center'>
            <h1 className="text-4xl font-bold mb-4">Comprehensive Security Deposit</h1>
            <p className="text-gray-600 ">
              2Wheeleeee provides comprehensive security deposit for your vehicle during rental periods, ensuring peace of mind for both hosts and renters. This coverage includes protection against damage, theft, and liability, offering you the security you need when renting out your bike. You can confidently share your vehicle knowing that it’s covered by a robust security policy, which minimizes potential risks and protects your investment. Our commitment to safety and security ensures that you and your bike are well-protected throughout the rental process, making your hosting experience stress-free and reliable.
            </p>
          </div>
          <div className='mb-40'>
            <img className='h-96' src={hostHome3} alt="Security deposit illustration" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Body;
