import { useNavigate } from "react-router-dom";
import { allFeedbacks } from "../../../Api/user";
import { useEffect, useState } from "react";
import loc from '../../../../public/assets/loc.png';
import calnder from '../../../../public/assets/calnder.png';
import veh from '../../../../public/assets/veh.png';
import middleLeft from '../../../../public/assets/middle-left.png';

export interface IFeedback {
  _id: string;
  userId: IUser;
  rating: number;
  feedback: string;
  createdAt: string;
}

interface IUser {
  _id: string
  name: string
  email: string
}

const Body = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await allFeedbacks();
        setFeedbacks(response.data);
      } catch (error: any) {
        console.error("Error fetching feedbacks", error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="bg-white w-full">
      {/* Hero Section - Modern Design */}
      <div className="bg-gradient-to-r from-sky-100 to-blue-50 w-full">
        <div className="container mx-auto py-24 px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0">
              <span className="bg-sky-100 text-sky-600 px-4 py-1 rounded-full text-sm font-medium mb-6 inline-block">
                Premium Bike Rentals
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-black bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent leading-tight">
                Find Happiness in Your Journey With Us
              </h1>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed max-w-lg">
                We offer the greatest service to you. Grab control of your journey with a smooth bike rental experience.
                Pick from our extensive selection of bikes for your perfect ride.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  className="bg-sky-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-sky-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  onClick={() => navigate('/BikeListPage')}
                >
                  Rent a Bike
                </button>
                <button
                  className="bg-transparent text-sky-500 font-semibold py-3 px-8 rounded-full border border-sky-500 hover:bg-sky-50 transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="bg-white p-4 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-sky-100 rounded-full"></div>
                <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-100 rounded-full"></div>

                <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl p-6 text-white text-center">
                  <div className="flex justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Quick and Easy Process</h3>
                  <p className="mb-4">Book your ride in 3 simple steps</p>
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white border-opacity-20">
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold">1</span>
                      </div>
                      <p className="text-sm">Choose Location</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold">2</span>
                      </div>
                      <p className="text-sm">Pick Date</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold">3</span>
                      </div>
                      <p className="text-sm">Book Bike</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="Services" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-sky-100 text-sky-500 font-medium text-sm mb-3">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Working Steps</h2>
            <div className="w-20 h-1 bg-sky-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <img src={loc} className="w-10 h-10" alt="Location icon" />
              </div>
              <h3 className="text-xl font-bold mb-3">Choose Location</h3>
              <p className="text-gray-600">
                When you choose a location, we'll provide you the available bikes. So you can get it simply.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <img src={calnder} className="w-10 h-10" alt="Calendar icon" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pick-Up Date</h3>
              <p className="text-gray-600">
                Choose the Pick-Up date so that you can schedule the trip easily.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <img src={veh} className="w-10 h-10" alt="Vehicle icon" />
              </div>
              <h3 className="text-xl font-bold mb-3">Book Your Bike</h3>
              <p className="text-gray-600">
                Book your favorite vehicle and enjoy your trip.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div id="about-us" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <img src={middleLeft} alt="About Us" className="w-full max-w-lg mx-auto rounded-lg shadow-lg" />
            </div>

            <div className="w-full md:w-1/2">
              <span className="inline-block py-1 px-3 rounded-full bg-sky-100 text-sky-500 font-medium text-sm mb-3">
                ABOUT US
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Feel The Best Experience With Our Rental Deals</h2>
              <div className="w-20 h-1 bg-sky-500 mb-6"></div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We are redefining the way people think about bike rental. Our platform connects bike owners with
                individuals in need of a ride, creating a community where mobility is shared, convenient, and sustainable.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We empower bike owners to turn their vehicles into income-generating assets while offering renters a
                diverse selection of bikes to suit their needs and budgets. Our commitment to safety, transparency,
                and ease of use makes us a trusted choice in the bike-sharing market.
              </p>
              <p className="text-gray-700 font-medium">
                Join us in driving a future where every journey is a shared adventure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      {feedbacks.length > 0 && (
        <div id="feedback" className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block py-1 px-3 rounded-full bg-sky-100 text-sky-500 font-medium text-sm mb-3">
                TESTIMONIALS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
              <div className="w-20 h-1 bg-sky-500 mx-auto"></div>
            </div>

            <div className={`grid gap-8 ${feedbacks.length === 1 ? "grid-cols-1" : feedbacks.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
              {feedbacks.slice(0, 3).map((fb) => (
                <div key={fb._id} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-sky-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {fb.userId.name.charAt(0)}
                    </div>
                    <h4 className="text-lg font-semibold">{fb.userId.name}</h4>
                  </div>
                  <div className="text-yellow-400 mb-4 text-xl">
                    {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
                  </div>
                  <p className="text-gray-600 italic">"{fb.feedback}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Body;