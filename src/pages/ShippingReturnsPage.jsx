import { Truck, RefreshCcw, ArrowLeftRight, Wallet } from "lucide-react";
import shippingBanner from "../assets/shipping-banner.jpg";
function ShippingReturnsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* HERO BANNER */}
      <section className="relative h-[70vh] overflow-hidden">
        <img
          src={shippingBanner}
          alt="Shipping & Returns"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <p className="uppercase tracking-[0.5em] text-sm mb-5">
              Customer Care
            </p>

            <h1 className="text-6xl md:text-8xl font-black mb-6">
              Shipping & Returns
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-white/80">
              Everything you need to know about shipping, delivery, exchanges
              and returns.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-24">
          <div className="border rounded-3xl p-8 hover:shadow-lg transition">
            <p className="text-gray-400 text-sm uppercase mb-3">Processing</p>

            <h3 className="text-3xl font-bold">1-2 Days</h3>
          </div>

          <div className="border rounded-3xl p-8 hover:shadow-lg transition">
            <p className="text-gray-400 text-sm uppercase mb-3">Delivery</p>

            <h3 className="text-3xl font-bold">2-5 Days</h3>
          </div>

          <div className="border rounded-3xl p-8 hover:shadow-lg transition">
            <p className="text-gray-400 text-sm uppercase mb-3">Returns</p>

            <h3 className="text-3xl font-bold">14 Days</h3>
          </div>

          <div className="border rounded-3xl p-8 hover:shadow-lg transition">
            <p className="text-gray-400 text-sm uppercase mb-3">Support</p>

            <h3 className="text-3xl font-bold">24/7</h3>
          </div>
        </div>

        {/* SHIPPING */}
        <div className="pb-20 border-b">
          <div className="flex items-center gap-4 mb-8">
            <Truck size={30} />

            <h2 className="text-3xl font-bold">Shipping Information</h2>
          </div>

          <div className="space-y-5 text-gray-600 leading-8 text-lg">
            <p>
              All orders are processed within 1–2 business days after payment
              confirmation.
            </p>

            <p>
              Standard delivery typically takes 2–5 business days depending on
              your location.
            </p>

            <p>
              Once your order has been shipped, a tracking number will be sent
              to your email address.
            </p>

            <p>
              During collection launches and promotional periods, shipping times
              may be slightly longer.
            </p>
          </div>
        </div>

        {/* RETURNS */}
        <div className="py-20 border-b">
          <div className="flex items-center gap-4 mb-8">
            <RefreshCcw size={30} />

            <h2 className="text-3xl font-bold">Returns Policy</h2>
          </div>

          <div className="space-y-5 text-gray-600 leading-8 text-lg">
            <p>We accept returns within 14 days from the date of delivery.</p>

            <p>
              Returned items must be unworn, unwashed and include all original
              tags and packaging.
            </p>

            <p>
              Products showing signs of wear or damage may not be eligible for
              return.
            </p>
          </div>
        </div>

        {/* EXCHANGE */}
        <div className="py-20 border-b">
          <div className="flex items-center gap-4 mb-8">
            <ArrowLeftRight size={30} />

            <h2 className="text-3xl font-bold">Exchanges</h2>
          </div>

          <div className="space-y-5 text-gray-600 leading-8 text-lg">
            <p>Size exchanges are available subject to stock availability.</p>

            <p>Please contact our support team before sending any item back.</p>

            <p>
              Exchange requests are processed as quickly as possible to ensure a
              smooth experience.
            </p>
          </div>
        </div>

        {/* REFUNDS */}
        <div className="pt-20">
          <div className="flex items-center gap-4 mb-8">
            <Wallet size={30} />

            <h2 className="text-3xl font-bold">Refunds</h2>
          </div>

          <div className="space-y-5 text-gray-600 leading-8 text-lg">
            <p>
              Once your return has been inspected and approved, your refund will
              be processed.
            </p>

            <p>
              Refunds may take 3–7 business days to appear depending on your
              payment method.
            </p>

            <p>
              You will receive a confirmation email once your refund has been
              completed.
            </p>
          </div>
        </div>
      </section>

      {/* HELP SECTION */}
      <section className="bg-black text-white py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <p className="tracking-[0.4em] uppercase text-sm text-gray-400 mb-4">
            Need Help?
          </p>

          <h2 className="text-5xl font-bold mb-6">We're Here To Help</h2>

          <p className="text-gray-400 mb-10 text-lg leading-8">
            If you have any questions regarding shipping, returns or exchanges,
            our customer care team is ready to assist.
          </p>

          <a
            href="/contact"
            className="
              inline-flex
              items-center
              justify-center
              bg-white
              text-black
              px-10
              py-4
              rounded-full
              font-semibold
              hover:bg-gray-200
              transition
            "
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}

export default ShippingReturnsPage;
