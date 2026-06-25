import { useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import NewsletterSection from "../components/NewsletterSection";
import {
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import bannercontact from "../assets/bannercontact.jpg";
function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/contact", form);

      toast.success(res.data.message);

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to send message");
    }
  };

  return (
    <>
      <div className="bg-white min-h-screen">
        {/* HERO BANNER */}

        <div className="relative h-screen overflow-hidden">
          <img
            src={bannercontact}
            alt="Contact Banner"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                CONTACT US
              </h1>
            </div>
          </div>
        </div>

        {/* CONTACT INFO CARDS */}

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2">Customer Service</h3>

              <p className="text-gray-500">support@hyno.com</p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2">WhatsApp</h3>

              <p className="text-gray-500">+84 123 456 789</p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2">Instagram</h3>

              <p className="text-gray-500">@hyno_official</p>
            </div>
          </div>

          {/* MAIN SECTION */}

          <div className="grid md:grid-cols-2 gap-16">
            {/* LEFT */}

            <div>
              <h2 className="text-3xl font-bold mb-8">Visit Our Boutique</h2>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <FaMapMarkerAlt size={24} className="mt-1" />

                  <div>
                    <h3 className="font-semibold mb-1">Store Address</h3>

                    <p className="text-gray-600">
                      123 Nguyen Hue Street
                      <br />
                      District 1
                      <br />
                      Ho Chi Minh City
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <FaClock size={24} className="mt-1" />

                  <div>
                    <h3 className="font-semibold mb-1">Opening Hours</h3>

                    <p className="text-gray-600">
                      Monday - Sunday
                      <br />
                      09:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <FaWhatsapp size={24} className="mt-1" />

                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>

                    <p className="text-gray-600">+84 123 456 789</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <FaInstagram size={24} className="mt-1" />

                  <div>
                    <h3 className="font-semibold mb-1">Instagram</h3>

                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-black underline"
                    >
                      @hyno_official
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT - FORM */}

            <div className="bg-white shadow-xl rounded-3xl p-8">
              <h2 className="text-3xl font-bold mb-8">Send Us A Message</h2>

              <form onSubmit={submit} className="space-y-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  p-4
                  focus:outline-none
                  focus:border-black
                "
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  p-4
                  focus:outline-none
                  focus:border-black
                "
                />

                <input
                  type="text"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  p-4
                  focus:outline-none
                  focus:border-black
                "
                />

                <textarea
                  rows="6"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  p-4
                  focus:outline-none
                  focus:border-black
                "
                />

                <button
                  type="submit"
                  className="
                  w-full
                  bg-black
                  text-white
                  py-4
                  rounded-xl
                  hover:bg-gray-800
                  transition
                "
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* GOOGLE MAP */}

          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-8 text-center">
              HYNO's Boutique
            </h2>

            <iframe
              title="HYNO Location"
              src="https://maps.google.com/maps?q=nguyen%20hue%20district%201%20hcmc&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <NewsletterSection />
      <Footer />
    </>
  );
}

export default ContactPage;
