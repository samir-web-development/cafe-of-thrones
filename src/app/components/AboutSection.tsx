import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AboutSectionProps {
  shopImage: string;
}

export function AboutSection({ shopImage }: AboutSectionProps) {
  const navigate = useNavigate();
  return (
    <section id="about" className="bg-[#f5ede0] relative overflow-hidden">
      {/* Decorative coffee cup SVGs */}
      <div className="absolute right-10 top-8 opacity-10">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M15 25h50v15a25 25 0 01-50 0V25z" stroke="#3d1f00" strokeWidth="3" />
          <path d="M55 25c0-4 3.6-7 8-7s8 3 8 7" stroke="#3d1f00" strokeWidth="3" strokeLinecap="round" />
          <rect x="15" y="55" width="50" height="5" rx="2.5" fill="#3d1f00" />
        </svg>
      </div>
      <div className="absolute right-28 bottom-10 opacity-10">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M10 18h40v12a20 20 0 01-40 0V18z" stroke="#3d1f00" strokeWidth="2.5" />
          <path d="M40 18c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" stroke="#3d1f00" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="relative rounded-3xl overflow-hidden h-80 md:h-96 shadow-xl">
          <ImageWithFallback
            src={shopImage}
            alt="Coffee shop interior"
            className="w-full h-full object-cover"
          />
          {/* Overlay badge */}
          <div className="absolute bottom-6 left-6 bg-white rounded-2xl p-4 shadow-lg">
            <p className="text-[#ECB159]" style={{ fontWeight: 800, fontSize: "1.4rem" }}>New ✦</p>
            <p className="text-[#7a5c3e]" style={{ fontSize: "0.78rem" }}>Est. 2024</p>
          </div>
        </div>

        {/* Text */}
        <div>
          <span className="inline-block text-[#ECB159] uppercase tracking-widest mb-3" style={{ fontSize: "0.78rem", fontWeight: 700 }}>Our story</span>
          <h2 className="text-[#2a1500] mb-4 leading-tight" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800 }}>
            Born from a love<br />of great coffee.
          </h2>
          <p className="text-[#7a5c3e] mb-6 max-w-md leading-relaxed" style={{ fontSize: "0.95rem" }}>
            We opened Cafe of Thrones last year with one belief: your local cafe should feel like a second home. Every drink is prepared fresh, every ingredient is chosen with care, and every visit should leave you smiling.
          </p>

          <div className="flex items-center gap-10 mb-8">
            <div>
              <p className="text-[#2a1500]" style={{ fontSize: "1.5rem", fontWeight: 800 }}>Est.</p>
              <p className="text-[#9e7c5a]" style={{ fontSize: "0.8rem" }}>2024</p>
            </div>
            <div>
              <p className="text-[#2a1500]" style={{ fontSize: "1.5rem", fontWeight: 800 }}>1</p>
              <p className="text-[#9e7c5a]" style={{ fontSize: "0.8rem" }}>Location (so far)</p>
            </div>
            <div>
              <p className="text-[#2a1500]" style={{ fontSize: "1.5rem", fontWeight: 800 }}>100%</p>
              <p className="text-[#9e7c5a]" style={{ fontSize: "0.8rem" }}>Handcrafted</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/menu", { state: { scrollTo: "coffee" } })}
            className="flex items-center gap-2 bg-[#3d1f00] text-white rounded-full px-7 py-3 hover:bg-[#5a2e00] transition-colors"
          >
            <span style={{ fontSize: "0.95rem" }}>Get your coffee</span>
            <span className="w-5 h-5 bg-[#ECB159] rounded-full flex items-center justify-center">
              <ChevronRight size={12} strokeWidth={3} className="text-white" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
