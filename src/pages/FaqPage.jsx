import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import faqBanner from "../assets/faq-banner.jpg"; // thay bằng ảnh của bạn

function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqCategories = [
    "Shipping",
    "Returns",
    "Payment",
    "Size Guide",
    "International",
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer:
        "Orders are processed within 1–2 business days. Standard delivery typically takes 2–5 business days depending on your location.",
    },
    {
      question: "Can I return my order?",
      answer:
        "Yes. Returns are accepted within 14 days of delivery. Items must be unworn, unwashed and returned with original tags attached.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order has been shipped, a tracking number will be sent to your email address.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We currently accept COD (Cash on Delivery), Bank Transfer and VNPay.",
    },
    {
      question: "Can I exchange a product?",
      answer:
        "Yes. Exchanges are available within 14 days if the item is unused and in original condition.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Currently HYNO ships within Vietnam. International shipping will be available in future collections.",
    },
    {
      question: "Can I use more than one coupon code?",
      answer:
        "Only one coupon code can be applied per order unless otherwise specified.",
    },
    {
      question: "What if I receive a damaged item?",
      answer:
        "Please contact our support team within 48 hours after receiving your package and we will assist you immediately.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* HERO BANNER */}
      <section className="relative h-[70vh] overflow-hidden">
        <img
          src={faqBanner}
          alt="FAQ Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <p className="uppercase tracking-[0.5em] text-sm mb-4">
              Customer Care
            </p>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Frequently Asked Questions
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-white/80">
              Everything you need to know about orders, shipping, returns,
              payments and customer support.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 -mt-14 relative z-10">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <p className="text-gray-400 uppercase text-xs mb-2">Shipping</p>
            <h3 className="text-3xl font-bold">2-5 Days</h3>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <p className="text-gray-400 uppercase text-xs mb-2">Returns</p>
            <h3 className="text-3xl font-bold">14 Days</h3>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <p className="text-gray-400 uppercase text-xs mb-2">Support</p>
            <h3 className="text-3xl font-bold">24/7</h3>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <p className="text-gray-400 uppercase text-xs mb-2">Response</p>
            <h3 className="text-3xl font-bold">&lt;24h</h3>
          </div>
        </div>
      </section>

      {/* CATEGORY BOXES */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {faqCategories.map((item) => (
            <div
              key={item}
              className="
                border
                rounded-2xl
                py-5
                text-center
                font-medium
                hover:bg-black
                hover:text-white
                transition
                cursor-pointer
              "
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="
                border
                border-gray-200
                rounded-3xl
                overflow-hidden
                transition
              "
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="
                  w-full
                  flex
                  justify-between
                  items-center
                  px-8
                  py-7
                  text-left
                "
              >
                <span className="font-semibold text-lg">{faq.question}</span>

                {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
              </button>

              <div
                className={`
                  overflow-hidden
                  transition-all
                  duration-300
                  ${openIndex === index ? "max-h-60 px-8 pb-8" : "max-h-0"}
                `}
              >
                <p className="text-gray-600 leading-8">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-black text-white py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <p className="uppercase tracking-[0.4em] text-sm text-gray-400 mb-4">
            Need More Help?
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Team Is Ready To Assist You
          </h2>

          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            If you couldn't find the answer you're looking for, feel free to
            contact our customer support team.
          </p>

          <a
            href="/contact"
            className="
              inline-flex
              items-center
              justify-center
              px-10
              py-4
              bg-white
              text-black
              rounded-full
              font-semibold
              hover:scale-105
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

export default FaqPage;
