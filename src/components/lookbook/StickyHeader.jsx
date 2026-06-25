function StickyHeader({ title }) {
  return (
    <div
      className="
        sticky
        top-8
        z-20
        mb-24
        pointer-events-none
      "
    >
      <div
        className="
          inline-block
          bg-white/80
          backdrop-blur-xl
          px-8
          py-5
          rounded-full
          shadow-lg
        "
      >
        <p className="text-xs uppercase tracking-[0.5em] text-gray-400">HYNO</p>

        <h3 className="mt-2 text-2xl font-bold uppercase">{title}</h3>
      </div>
    </div>
  );
}

export default StickyHeader;
