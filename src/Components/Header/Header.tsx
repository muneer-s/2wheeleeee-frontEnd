import React from 'react';

const Header = () => {
  return (
    <header className="bg-white px-8 py-2 flex items-center justify-between shadow-md w-full mx-auto">
      {/* Logo */}
      <div className="text-2xl font-bold text-sky-500">
        2Wheeeee
      </div>

      {/* Navigation and Button on the right */}
      <div className="flex items-center space-x-8">
        <nav>
          <ul className="flex space-x-8">
            <li><a href="/" className="text-black hover:text-sky-500">Home</a></li>
            <li><a href="/about" className="text-black hover:text-sky-500">About Us</a></li>
            <li><a href="/services" className="text-black hover:text-sky-500">Services</a></li>
            <li><a href="/contact" className="text-black hover:text-sky-500">Contact Us</a></li>
          </ul>
        </nav>

        {/* Sign In Button */}
        <button className="bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600">
          Sign In
        </button>
      </div>
    </header>
  );
};

export default Header;
