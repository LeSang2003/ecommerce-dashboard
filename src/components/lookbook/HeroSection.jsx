import { motion, useScroll, useTransform } from "framer-motion";

function HeroSection({ lookbook, getImageUrl }) {
  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 800], [0, 120]);

  const heroScale = useTransform(scrollY, [0, 800], [1.08, 1]);

  return (
    <section className="relative h-screen overflow-hidden">
      <motion.img
        src={getImageUrl(lookbook.coverImage)}
        alt={lookbook.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          y: heroY,
          scale: heroScale,
        }}
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex justify-center items-center h-full">
        <div className="text-center text-white">
          <p className="uppercase tracking-[0.6em] text-sm">HYNO</p>

          <h1 className="text-7xl md:text-[140px] xl:text-[180px] font-black uppercase">
            {lookbook.title}
          </h1>

          <p className="uppercase tracking-[0.4em] mt-8">
            {lookbook.season} {lookbook.year}
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
