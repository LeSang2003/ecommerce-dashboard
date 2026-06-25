import { motion } from "framer-motion";

export default function QuoteSection({ section }) {
  if (!section) return null;

  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-10">
      <div className="max-w-6xl mx-auto text-center">
        <motion.blockquote
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
          }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl xl:text-[140px] font-light leading-[1.15] italic tracking-tight"
        >
          "{section.content}"
        </motion.blockquote>
        <p className="mt-10 uppercase tracking-[10px] text-sm text-gray-400">
          HYNO
        </p>
        {section.author && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className=" uppercase tracking-[8px] text-xs opacity-60"
          >
            — {section.author}
          </motion.p>
        )}
      </div>
    </section>
  );
}
