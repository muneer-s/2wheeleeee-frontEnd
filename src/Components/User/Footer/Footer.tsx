
const Footer = () => {

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">2Wheeleee</h2>
          <p className="text-sm max-w-xl mx-auto">
            Grab control of your journey with a smooth bike rental experience. We have the ideal
            two-wheeler to suit your needs, whether you're planning an exciting road trip or a simple
            ride through the city. Pick from our extensive selection of bikes, which includes resilient
            motorbikes, high-end models, and sleek city scooters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <h4 className="text-lg font-semibold mb-3">Our Links</h4>
            <ul className="space-y-2">


              <li>
                <a href="/" className="hover:text-gray-400">
                  Home
                </a>
              </li>
              <li>
                <a href="#about"
                  className="hover:text-gray-400"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("about-us");
                  }}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact"
                  className="hover:text-gray-400"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("feedback");
                  }}
                >
                  Feedbacks
                </a>
              </li>
              <li>
                <a href="#services"
                  className="hover:text-gray-400"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("Services");
                  }}
                >
                  Services
                </a>
              </li>


            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Other Links</h4>
            <ul className="space-y-2">
              <li><a href="#faq" className="hover:text-gray-400">FAQ</a></li>
              <li><a href="#support" className="hover:text-gray-400">Support</a></li>
              <li><a href="#privacy" className="hover:text-gray-400">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-gray-400">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Mail</h4>
            <p><a href="mailto:2wheeleee@gmail.com" className="hover:text-gray-400">2wheeleee@gmail.com</a></p>

            <h4 className="text-lg font-semibold mt-4">Location</h4>
            <p>Pattambi, Palakkad, Kerala</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Call Now</h4>
            <p><a href="tel:44002586324" className="hover:text-gray-400">4400-258-6324</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
