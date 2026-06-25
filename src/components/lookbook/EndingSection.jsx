import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function EndingSection({ section }) {
  if (!section) return null;

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <motion.img
        initial={{
          scale: 1.15,
        }}
        whileInView={{
          scale: 1,
        }}
        transition={{
          duration: 2,
        }}
        viewport={{
          once: true,
        }}
        src={section.image}
        alt={section.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <motion.div
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        transition={{
          duration: 1,
        }}
        viewport={{
          once: true,
        }}
        className="absolute inset-0 bg-black/35"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 80,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          viewport={{ once: true }}
          className="text-center text-white px-8"
        >
          <p className="uppercase tracking-[8px] text-sm mb-6">End of Story</p>

          <h2 className="text-5xl md:text-8xl font-black uppercase leading-none">
            {section.title}
          </h2>

          {section.description && (
            <p className="max-w-2xl mx-auto mt-8 text-lg opacity-90 leading-8">
              {section.description}
            </p>
          )}

          {section.buttonText && (
            <Link
              to={section.buttonLink}
              className="inline-block mt-12 border border-white px-10 py-4 uppercase tracking-[4px] text-sm hover:bg-white hover:text-black transition-all duration-500"
            >
              {section.buttonText}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
