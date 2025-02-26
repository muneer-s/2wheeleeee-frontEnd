import { useNavigate } from "react-router-dom";
import { allFeedbacks } from "../../../Api/user";
import { useEffect, useState } from "react";

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
  const navigate = useNavigate()
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
    <div className="bg-white text-center py-12 w-full">

      <div className="flex justify-between items-center w-full px-0  mx-auto">
        {/* <img src="/src/assets/left.png" alt="Yellow Scooter" className="w-1/3" /> */}
        <img src="/public/assets/left.png" alt="Yellow Scooter" className="w-1/3" />

        <div className="max-w-md mx-6 text-center">
          <h1 className="text-4xl font-bold mb-4 text-black">
            Find Happiness in Your Journey With Us
          </h1>
          <p className="text-gray-700 text-sm mb-6 leading-relaxed">
            We offer the greatest service to you. Grab control of your journey with a smooth bike rental experience. We have the ideal two-wheeler to suit your needs, whether you're planning an exciting road trip or a simple ride through the city. Pick from our extensive selection of bikes, which includes resilient motorbikes, high-end models, and sleek city scooters
          </p>
          <button
            className="bg-transparent text-sky-500 font-semibold py-2 px-6 border border-sky-500 rounded hover:bg-sky-500 hover:text-white"
            onClick={() => navigate('/BikeListPage')}
          >
            Rent a Bike
          </button>
        </div>

        <img src="/src/assets/right.png" alt="Motorbike" className="w-1/3" />
      </div>


      <div id='Services' className="py-12 ">
        <h2 className="text-3xl font-bold mb-6 text-sky-500">How It Works</h2>
        <h2 className="text-3xl font-bold mb-6">Our working steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 justify-items-center">
          <div className="p-4 w-80">
            <img src="/src/assets/loc.png" className="mx-auto mb-4 w-20 h-20" ></img>
            <h3 className="text-xl font-semibold mb-2">Choose Location</h3>
            <p className="text-gray-700 text-sm">
              When you choose a location, we’ll provide you the available bikes. So you can get it simply.
            </p>
          </div>
          <div className="p-4">
            <img src="/src/assets/calnder.png" className="mx-auto mb-4 w-20 h-20" ></img>
            <h3 className="text-xl font-semibold mb-2">Pick-Up Date</h3>
            <p className="text-gray-700 text-sm">
              Choose the Pick-Up date so that you can schedule the trip easily.
            </p>
          </div>
          <div className="p-4">
            <img src="/src/assets/veh.png" className="mx-auto mb-4 w-20 h-20" ></img>
            <h3 className="text-xl font-semibold mb-2">Book Your Bike</h3>
            <p className="text-gray-700 text-sm">
              Book your favorite vehicle and enjoy your trip.
            </p>
          </div>
        </div>
      </div>


      {/* about us section */}
      <div id="about-us" className="flex bg-white py-12">

        <div className="w-1/2 flex justify-start items-center">
          <img src="/src/assets/middle-left.png" alt="About Us" className="w-full max-w-lg" />
        </div>

        <div className="w-1/2 py-12 px-6 bg-white">
          <h2 className="text-3xl font-bold mb-6 text-sky-500">About Us</h2>
          <h3 className="text-2xl font-bold mb-4">Feel The Best Experience With Our Rental Deals</h3>
          <p className="text-gray-700 text-sm max-w-3xl mx-auto mb-6 leading-relaxed">
            We are redefining the way people think about bike rental. Our platform connects bike owners with individuals in need of a ride, creating a community where mobility is shared, convenient, and sustainable. We empower bike owners to turn their vehicles into income-generating assets while offering renters a diverse selection of bikes to suit their needs and budgets. Our commitment to safety, transparency, and ease of use makes us a trusted choice in the bike-sharing market.
          </p>
          <p className="text-gray-700 text-sm max-w-3xl mx-auto leading-relaxed">
            Join us in driving a future where every journey is a shared adventure.
          </p>
        </div>

      </div>

      {feedbacks.length > 0 && (
        <div id='feedback' className="py-12 bg-white">
          <h2 className="text-3xl font-bold mb-6 text-sky-500">Feedback</h2>
          <h3 className="text-2xl font-bold mb-6">What Our Customers Say</h3>

          <div
            className={`grid gap-y-8 justify-items-center 
      ${feedbacks.length === 1 ? "grid-cols-1" : feedbacks.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
          >
            {feedbacks.slice(0, 3).map((fb) => (
              <div key={fb._id} className="p-4 bg-[rgb(170,223,242)] shadow-md rounded-md w-80">
                <p className="text-yellow-500 mb-2">
                  {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
                </p>
                <p className="text-gray-700 text-sm mb-4">"{fb.feedback}"</p>
                <h4 className="text-lg font-semibold">{fb.userId.name}</h4>
              </div>
            ))}
          </div>
        </div>
      )}



    </div>
  );
};

export default Body;
