import aboutBanner from "../assets/about-banner.jpg";
import aboutImage from "../assets/about-story.jpg";
import editorialImage from "../assets/about-editorial.jpg";

function AboutPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <img
          src={aboutBanner}
          alt="HYNO"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <p className="uppercase tracking-[0.5em] text-sm mb-6">
              Since 2026
            </p>

            <h1 className="text-6xl md:text-8xl font-black mb-6">ABOUT HYNO</h1>

            <p className="max-w-2xl mx-auto text-lg text-white/80">
              Contemporary fashion inspired by confidence, simplicity and
              timeless design.
            </p>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <img
              src={aboutImage}
              alt="HYNO Story"
              className="w-full aspect-[4/5] object-cover rounded-3xl"
            />
          </div>

          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-gray-400 mb-4">
              Our Story
            </p>

            <h2 className="text-5xl font-bold leading-tight mb-8">
              Fashion That Feels Effortless
            </h2>

            <div className="space-y-6 text-gray-600 leading-8 text-lg">
              <p>
                HYNO was born from the belief that true style should feel
                natural, refined and effortless.
              </p>

              <p>
                We design garments that combine contemporary silhouettes with
                timeless craftsmanship.
              </p>

              <p>
                Every collection is created with a focus on quality materials,
                clean lines and lasting wearability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-[#f7f5f2] py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="uppercase tracking-[0.3em] text-sm text-gray-400 mb-4">
            Mission
          </p>

          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Creating timeless essentials for modern lifestyles.
          </h2>

          <p className="max-w-3xl mx-auto mt-8 text-gray-600 text-lg leading-8">
            HYNO exists to deliver elevated everyday pieces that inspire
            confidence and individuality while maintaining simplicity and
            elegance.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.3em] text-sm text-gray-400 mb-4">
              Our Values
            </p>

            <h2 className="text-5xl font-bold">What We Stand For</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="border rounded-3xl p-10">
              <h3 className="text-3xl font-bold mb-5">Quality</h3>

              <p className="text-gray-600 leading-8">
                Premium fabrics, exceptional craftsmanship and attention to
                every detail.
              </p>
            </div>

            <div className="border rounded-3xl p-10">
              <h3 className="text-3xl font-bold mb-5">Timeless Design</h3>

              <p className="text-gray-600 leading-8">
                Clothing created to outlive seasonal trends and remain relevant
                for years.
              </p>
            </div>

            <div className="border rounded-3xl p-10">
              <h3 className="text-3xl font-bold mb-5">Confidence</h3>

              <p className="text-gray-600 leading-8">
                Pieces designed to help people feel comfortable, empowered and
                authentic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL IMAGE */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <img
            src={editorialImage}
            alt="HYNO Editorial"
            className="w-full h-auto rounded-3xl"
          />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-black text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div>
              <h3 className="text-5xl font-black">2026</h3>
              <p className="text-gray-400 mt-3">Founded</p>
            </div>

            <div>
              <h3 className="text-5xl font-black">100+</h3>
              <p className="text-gray-400 mt-3">Products</p>
            </div>

            <div>
              <h3 className="text-5xl font-black">10K+</h3>
              <p className="text-gray-400 mt-3">Customers</p>
            </div>

            <div>
              <h3 className="text-5xl font-black">100%</h3>
              <p className="text-gray-400 mt-3">Passion</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-4xl md:text-6xl font-light leading-tight">
            “Great style begins with simplicity.”
          </blockquote>

          <p className="mt-10 uppercase tracking-[0.4em] text-sm text-gray-500">
            HYNO
          </p>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
