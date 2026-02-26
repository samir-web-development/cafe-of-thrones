import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChevronRight, Star, MapPin, X, Home, Coffee } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const COFFEE_SLIDES = [
  { src: "/cafe-items/coffee/Hot Coffeen.jpg", label: "Hot Coffee" },
  { src: "/cafe-items/coffee/Cold Coffee (Plain).jpg", label: "Cold Coffee" },
  { src: "/cafe-items/coffee/Cold Coffee (Vanilla).jpg", label: "Vanilla Cold Coffee" },
  { src: "/cafe-items/coffee/Cold Coffee (Crush).jpg", label: "Crush Cold Coffee" },
  { src: "/cafe-items/coffee/Cold Coffee with Chocolate Ice Cream.jpg", label: "Choco Ice Cream Coffee" },
];

interface HeroProps {
  cappuccinoImg: string;
}

// Coffee bean SVG component
function CoffeeBean({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="18" viewBox="0 0 28 18" fill="none">
      <ellipse cx="14" cy="9" rx="13" ry="8.5" fill="#3d1f00" opacity="0.85" />
      <path d="M14 1.5C14 1.5 8 5.5 8 9s6 7.5 6 7.5" stroke="#6b3a1f" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function Hero({ cappuccinoImg }: HeroProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSlideIndex((i) => (i + 1) % COFFEE_SLIDES.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const slide = COFFEE_SLIDES[slideIndex];

  return (
    <section id="hero" className="bg-[#fdf6ec] overflow-hidden relative">
      {/* Scattered coffee beans - decorative */}
      <CoffeeBean className="absolute top-16 left-[55%] rotate-[30deg] opacity-70" />
      <CoffeeBean className="absolute top-8 left-[62%] rotate-[-20deg] opacity-60 scale-75" />
      <CoffeeBean className="absolute top-32 left-[70%] rotate-[60deg] opacity-50" />
      <CoffeeBean className="absolute top-4 left-[75%] rotate-[-45deg] opacity-40 scale-90" />
      <CoffeeBean className="absolute top-48 left-[58%] rotate-[10deg] opacity-65 scale-110" />
      <CoffeeBean className="absolute top-12 right-12 rotate-[-30deg] opacity-55" />
      <CoffeeBean className="absolute top-40 right-6 rotate-[70deg] opacity-45 scale-75" />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="relative z-10">
          <h1 className="text-[#2a1500] leading-tight mb-4" style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 800 }}>
            Your neighbourhood{" "}
            <span className="text-[#ECB159] italic">coffee</span>
            <br />
            stop, reimagined
          </h1>
          <p className="text-[#7a5c3e] mb-8 max-w-sm" style={{ fontSize: "0.97rem" }}>
            Freshly brewed coffee, made-to-order snacks, and a cozy corner that feels like home. We opened last year and we're just getting started.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => {
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-[#3d1f00] text-white rounded-full px-7 py-3 hover:bg-[#5a2e00] active:scale-95 transition-all shadow-sm"
            >
              <span style={{ fontSize: "0.95rem" }}>Order now</span>
              <span className="w-5 h-5 bg-[#ECB159] rounded-full flex items-center justify-center">
                <ChevronRight size={12} strokeWidth={3} className="text-white" />
              </span>
            </button>
            <button
              onClick={() => setIsMapOpen(true)}
              className="group flex items-center gap-1.5 text-[#ECB159] border-b border-[#ECB159] pb-0.5 hover:text-[#d49a3d] hover:border-[#d49a3d] transition-colors" style={{ fontSize: "0.95rem" }}
            >
              Find us
              <MapPin size={16} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12">
            <div>
              <p className="text-[#2a1500]" style={{ fontSize: "1.6rem", fontWeight: 800 }}>30+</p>
              <p className="text-[#9e7c5a]" style={{ fontSize: "0.82rem" }}>Menu Items</p>
            </div>
            <div className="w-px h-10 bg-[#e8d9c8]" />
            <div>
              <p className="text-[#2a1500]" style={{ fontSize: "1.6rem", fontWeight: 800 }}>1 yr</p>
              <p className="text-[#9e7c5a]" style={{ fontSize: "0.82rem" }}>Open & Brewing</p>
            </div>
            <div className="w-px h-10 bg-[#e8d9c8]" />
            <div>
              <p className="text-[#2a1500]" style={{ fontSize: "1.6rem", fontWeight: 800 }}>★ New</p>
              <p className="text-[#9e7c5a]" style={{ fontSize: "0.82rem" }}>& Growing</p>
            </div>
          </div>
        </div>

        {/* Right: Cycling Coffee Circle */}
        <div className="relative flex items-center justify-center mt-4 md:mt-0">
          {/* Outer ring */}
          <div className="absolute w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-[#3d1f00] opacity-90 z-0" />

          {/* Image circle with crossfade */}
          <div className="relative z-10 w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-[#ECB159]/30">
            <AnimatePresence mode="sync">
              <motion.div
                key={slide.src}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              >
                <ImageWithFallback
                  src={slide.src}
                  alt={slide.label}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>


          {/* Dot indicators — spaced below the circle */}
          <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {COFFEE_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`rounded-full transition-all duration-300 ${i === slideIndex ? "w-4 h-1.5 bg-[#ECB159]" : "w-1.5 h-1.5 bg-[#3d1f00]/30"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mini Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl relative shadow-2xl"
            style={{ animation: "modalIn 0.3s ease-out forwards" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#e8d9c8] bg-[#fdf6ec]">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-[#ECB159]" />
                <h3 className="text-[#3d1f00] font-bold text-lg">Our Location</h3>
              </div>
              <button
                onClick={() => setIsMapOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#e8d9c8] text-[#7a5c3e] hover:bg-[#f5ede0] transition-colors"
                aria-label="Close map"
              >
                <X size={18} />
              </button>
            </div>
            {/* Map Frame */}
            <div className="w-full h-[60vh] md:h-[420px] bg-[#fdf6ec]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d152285.83350190206!2d-1.282914104085695!3d52.937213444031634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4879c9bf66b3d5ab%3A0xc3f5af9ccbd8037a!2sNottingham%2C%20UK!5e0!3m2!1sen!2sus!4v1714420800000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Cafe Location"
              ></iframe>
            </div>

            {/* Modal Footer (Actions) */}
            <div className="p-4 border-t border-[#e8d9c8] bg-white flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsMapOpen(false);
                  setTimeout(() => {
                    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#e8d9c8] text-[#7a5c3e] font-semibold hover:bg-[#fdf6ec] hover:border-[#ECB159] hover:text-[#c0862d] active:scale-95 transition-all"
              >
                <Home size={18} />
                Home
              </button>
              <button
                onClick={() => {
                  setIsMapOpen(false);
                  setTimeout(() => {
                    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ECB159] text-white font-semibold shadow-md shadow-[#ECB159]/20 hover:bg-[#d49a3d] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <Coffee size={18} />
                Full Menu
              </button>
            </div>
          </div>
          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </section>
  );
}
