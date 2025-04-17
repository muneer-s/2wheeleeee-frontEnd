import { useNavigate } from 'react-router-dom';
import hostHome1 from '../../../../public/assets/hostHome1.png';
import hostHome2 from '../../../../public/assets/hostHome2.png';
import hostHome3 from '../../../../public/assets/hostHome3.png';
import { useAppSelector } from '../../../Apps/store';
import { isAdminVerifyUser } from '../../../Api/host';
import { handleApiResponse } from '../../../Utils/apiUtils';

function Body() {
  const navigate = useNavigate();

  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user;
  const userId = userDetails.userId;

  const gotoRegisterPage = async () => {
    const response = await isAdminVerifyUser(userId);
    const data = handleApiResponse(response);
    if (data.user?.isUser) {
      navigate('/hostBikeListPage');
    } else {
      navigate('/hostWaitingPage');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                Turn Your Bike Into <span className="text-sky-600">Passive Income</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                2Wheeleeee makes it easy for you to earn extra income by renting out your bike to trusted drivers. Simply list your asset, set your availability, and watch as your vehicle works for you.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <button 
                onClick={gotoRegisterPage} 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 transition duration-200 transform hover:scale-105"
              >
                Start Hosting Now
              </button>
              <p className="text-sm text-gray-500 mt-2 sm:mt-0 sm:ml-2">Join our community of bike hosts today!</p>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-sky-600">500+</p>
                <p className="text-sm text-gray-500">Active Hosts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-sky-600">₹15K+</p>
                <p className="text-sm text-gray-500">Avg. Monthly Income</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-sky-600">100%</p>
                <p className="text-sm text-gray-500">Secure Platform</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full blur opacity-30"></div>
              <div className="relative bg-white p-4 rounded-full shadow-xl">
                <img src={hostHome1} alt="Hosting illustration" className="w-full max-w-md mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Host With 2Wheeleeee?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              Our platform offers everything you need to rent your bike with confidence
            </p>
          </div>

          {/* Feature 1 */}
          <div className="mt-20">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900">Flexible Scheduling</h3>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    2Wheeleeee empowers you with complete control over your vehicle's availability through a flexible
                    scheduling system. Specify the days and times your bike is available for rent.
                  </p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Set custom availability periods
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Block out personal use days
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Manage bookings on-the-go
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-sky-100 transform rotate-3 rounded-2xl"></div>
                  <img src={hostHome2} alt="Scheduling illustration" className="relative w-full max-w-md mx-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="mt-32">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-100 to-blue-100 transform -rotate-3 rounded-2xl"></div>
                  <img src={hostHome3} alt="Security deposit illustration" className="relative w-full max-w-md mx-auto" />
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900">Comprehensive Security Deposit</h3>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    2Wheeleeee provides comprehensive security deposit for your vehicle during rental periods, ensuring
                    peace of mind for both hosts and renters.
                  </p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Full coverage protection
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Quick claims processing
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified renter profiles
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-sky-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start earning?</span>
            <span className="block text-sky-200">Join our host community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={gotoRegisterPage}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-sky-600 bg-white hover:bg-sky-50 transition duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Body;