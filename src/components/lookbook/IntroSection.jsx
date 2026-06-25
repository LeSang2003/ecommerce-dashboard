import { motion } from "framer-motion";

function IntroSection({ lookbook }) {
  return (
    <motion.section
      className="max-w-4xl mx-auto py-36 px-6 text-center"
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.8,
      }}
    >
      <p className="uppercase tracking-[0.5em] text-gray-400">
        HYNO COLLECTION
      </p>

      <h2 className="text-5xl md:text-6xl font-bold mt-6">{lookbook.title}</h2>

      <p className="mt-10 text-gray-600 leading-10 text-xl">
        {lookbook.description}
      </p>
    </motion.section>
  );
}

export default IntroSection;
