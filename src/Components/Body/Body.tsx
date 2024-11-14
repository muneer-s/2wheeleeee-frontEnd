
const Body = () => {
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
          <button className="bg-transparent text-sky-500 font-semibold py-2 px-6 border border-sky-500 rounded hover:bg-sky-500 hover:text-white">
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
    </div>
  );
};

export default Body;
