import React from 'react';

const Body = () => {
  return (
    <div className="bg-white text-center py-12 w-full">
      {/* Main Content Section */}
      <div className="flex justify-between items-center w-full px-0  mx-auto">
        {/* Left Image */}
        <img src="/src/assets/left.png" alt="Yellow Scooter" className="w-1/3" />

        {/* Center Text Content */}
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

        {/* Right Image */}
        <img src="/src/assets/right.png" alt="Motorbike" className="w-1/3" />
      </div>
    </div>
  );
};

export default Body;
