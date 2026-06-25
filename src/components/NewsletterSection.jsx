import { useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const subscribeNewsletter = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/newsletter/subscribe", {
        email,
      });

      toast.success(res.data.message);

      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-4xl mx-auto text-center px-6">
        <p className="uppercase tracking-[8px] text-gray-400 mb-4">
          Newsletter
        </p>

        <h2 className="text-5xl md:text-7xl font-bold mb-6">
          Join The HYNO Community
        </h2>

        <p className="text-gray-400 mb-12">
          Receive exclusive product drops, collection launches and member-only
          offers.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            subscribeNewsletter();
          }}
          className="flex flex-col md:flex-row max-w-2xl mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              flex-1
              px-6
              py-5
              text-black
              outline-none
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              bg-white
              text-black
              px-10
              py-5
              font-semibold
              uppercase
              transition
              hover:bg-gray-200
              disabled:opacity-50
            "
          >
            {loading ? "Loading..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default NewsletterSection;
