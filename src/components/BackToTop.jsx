import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: [0, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={scrollTop}
      className="
    fixed
    bottom-6
    right-6
    z-50
    bg-black
    text-white
    p-4
    rounded-full
    shadow-xl
  "
    >
      <ChevronUp size={24} />
    </motion.button>
  );
}

export default BackToTop;
