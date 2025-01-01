import { useNavigate } from "react-router-dom";

const Body = () => {

  const navigate = useNavigate()
  return (
    <div className="bg-white text-center py-12 w-full">

      <div className="flex justify-between items-center w-full px-0  mx-auto">
        <img src="/src/assets/left.png" alt="Yellow Scooter" className="w-1/3" />

        <div className="max-w-md mx-6 text-center">
          <h1 className="text-4xl font-bold mb-4 text-black">
            Find Happiness in Your Journey With Us
          </h1>
          <p className="text-gray-700 text-sm mb-6 leading-relaxed">
            We offer the greatest service to you. Grab control of your journey with a smooth bike rental experience. We have the ideal two-wheeler to suit your needs, whether you're planning an exciting road trip or a simple ride through the city. Pick from our extensive selection of bikes, which includes resilient motorbikes, high-end models, and sleek city scooters
          </p>
          <button 
          className="bg-transparent text-sky-500 font-semibold py-2 px-6 border border-sky-500 rounded hover:bg-sky-500 hover:text-white"
          onClick={()=>navigate('/UserBikeListPage')}
          >
            Rent a Bike
          </button>
        </div>

        <img src="/src/assets/right.png" alt="Motorbike" className="w-1/3" />
      </div>


      <div className="py-12 ">
        <h2 className="text-3xl font-bold mb-6 text-sky-500">How It Works</h2>
        <h2 className="text-3xl font-bold mb-6">Our working steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 justify-items-center">
          <div className="p-4 w-80">
            <img src="/src/assets/loc.png" className="mx-auto mb-4 w-20 h-20" ></img>
            <h3 className="text-xl font-semibold mb-2">Choose Your Location</h3>
            <p className="text-gray-700 text-sm">
              When you choose your location, we’ll provide you the nearest available bikes. So you can get it simply.
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

      <div className="flex bg-white py-12">
        
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


      <div className="py-12 bg-white">
        <h2 className="text-3xl font-bold mb-6 text-sky-500">Feedback</h2>
        <h3 className="text-2xl font-bold mb-6">What Our Customers Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 justify-items-center">
          <div className="p-4 bg-[rgb(170,223,242)] shadow-md rounded-md w-80">
            <p className="text-yellow-500 mb-2">★★★★★</p>
            <p className="text-gray-700 text-sm mb-4">
              "I had an amazing experience with ZWheelers. Listing my bike was straightforward and the rental process was smooth and secure."
            </p>
            <h4 className="text-lg font-semibold">Anas</h4>
            <p className="text-gray-500 text-sm">Host</p>
          </div>
          <div className="p-4 bg-[rgb(170,223,242)] shadow-md rounded-md w-80">
            <p className="text-yellow-500 mb-2">★★★★★</p>
            <p className="text-gray-700 text-sm mb-4">
              "As a renter, ZWheelers exceeded my expectations. I found the perfect bike just a few blocks away from my apartment, and the owner was friendly and accommodating."
            </p>
            <h4 className="text-lg font-semibold">Manu</h4>
            <p className="text-gray-500 text-sm">Customer</p>
          </div>
          <div className="p-4 bg-[rgb(170,223,242)] shadow-md rounded-md w-80">
            <p className="text-yellow-500 mb-2">★★★★★</p>
            <p className="text-gray-700 text-sm mb-4">
              "I've been using ZWheelers for a few months now. Both as a bike owner and a renter, the reliability of the platform allows me to choose renters who will enjoy my bike and ride it responsibly."
            </p>
            <h4 className="text-lg font-semibold">Neeraj</h4>
            <p className="text-gray-500 text-sm">Customer</p>
          </div>
        </div>
      </div>




    </div>
  );
};

export default Body;
