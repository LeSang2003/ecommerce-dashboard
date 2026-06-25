import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-[1600px] mx-auto px-6 py-24">
        <div className="grid md:grid-cols-4 gap-12">
          {/* BRAND */}
          <div>
            <h2 className="text-6xl font-black tracking-widest mb-5">HYNO</h2>

            <p className="text-gray-400 text-lg leading-8">
              Modern Tailoring & Timeless Design.
            </p>
          </div>

          {/* SHOP */}
          <div>
            <h3 className="uppercase tracking-widest text-base mb-6 font-semibold">
              Shop
            </h3>

            <div className="space-y-4 text-gray-400 text-lg">
              <Link to="/shop" className="block">
                Shop
              </Link>

              <Link to="/lookbook" className="block">
                Lookbook
              </Link>
            </div>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="uppercase tracking-widest text-base mb-6 font-semibold">
              Support
            </h3>

            <div className="space-y-4 text-gray-400 text-lg">
              <Link to="/faq" className="block">
                FAQ
              </Link>

              <Link to="/contact" className="block">
                Contact
              </Link>

              <Link to="/shipping-returns" className="block">
                Shipping & Returns
              </Link>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="uppercase tracking-widest text-base mb-6 font-semibold">
              Company
            </h3>

            <div className="space-y-4 text-gray-400 text-lg">
              <Link to="/about" className="block">
                About Us
              </Link>

              <div className="flex gap-5 mt-8 text-2xl">
                <a href="#">
                  <FaInstagram />
                </a>

                <a href="#">
                  <FaFacebookF />
                </a>

                <a href="#">
                  <FaTiktok />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 text-gray-500 text-base">
          © 2026 HYNO. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
