import { motion } from "framer-motion";

export default function TextSection({ section }) {
  return (
    <section className="min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-12 w-full">
        <motion.div
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
          className="grid lg:grid-cols-2 gap-24"
        >
          <div>
            <p className="uppercase tracking-[8px] text-xs text-gray-400 mb-6">
              Editorial
            </p>

            <h2 className="text-5xl md:text-7xl xl:text-8xl font-black uppercase leading-none">
              {section.title}
            </h2>
          </div>

          <div>
            <p className="text-xl md:text-2xl text-gray-600 leading-[2]">
              {section.content}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
