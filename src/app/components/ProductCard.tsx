import { useState } from "react";
import { ShoppingCart, Star, Check, Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
  tags: string[];
  description?: string;
  hideCart?: boolean;
}

const TAG_STYLES: Record<string, string> = {
  Hot: "bg-[#fff3e0] text-[#c0581a] border-[#f5d0a9]",
  Cold: "bg-[#e8f4fd] text-[#1a6fa0] border-[#b3d9f0]",
  Cafe: "bg-[#f3ede8] text-[#7a5c3e] border-[#e8d9c8]",
  Burger: "bg-[#ffe0b2] text-[#e65100] border-[#ffcc80]",
  Pizza: "bg-[#ffccbc] text-[#bf360c] border-[#ffab91]",
  Coffee: "bg-[#d7ccc8] text-[#5d4037] border-[#bcaaa4]",
  Mocktail: "bg-[#e0f7fa] text-[#006064] border-[#b2ebf2]",
  Snacks: "bg-[#fff9c4] text-[#f57f17] border-[#fff59d]",
  Sandwich: "bg-[#dcedc8] text-[#33691e] border-[#c5e1a5]",
};

export function ProductCard({ id, name, price, rating, image, tags, description, hideCart }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { cartItems, addToCart, updateQuantity } = useCart();

  const cartItem = cartItems.find(item => item.id === id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addToCart({ id, name, price, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[1.02] active:-translate-y-1 active:shadow-lg transition-all duration-200 ease-out group border border-[#f0e4d4] flex flex-col h-full relative">
      {/* Image — overflow clipped here only */}
      <div className="relative h-36 sm:h-40 md:h-44 overflow-hidden bg-[#f5ede0] shrink-0 rounded-t-2xl">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Rating badge */}
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
          <Star size={10} className="text-[#ECB159] fill-[#ECB159]" />
          <span className="text-[#3d1f00]" style={{ fontSize: "0.72rem", fontWeight: 700 }}>{rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 rounded-b-2xl bg-white">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-1 mb-1 relative">
          <div className="relative w-full" style={{ maxWidth: "65%", height: "1.4em", overflow: "hidden" }}>
            {/* Static name — fades out on hover/active */}
            <h3
              className="text-[#2a1500] truncate transition-opacity duration-200 group-hover:opacity-0 group-active:opacity-0 absolute inset-0 flex items-center"
              style={{ fontWeight: 700, fontSize: "clamp(0.82rem, 2.5vw, 0.97rem)" }}
            >
              {name}
            </h3>

            {/* Scroll-left reveal — fades in on hover/active */}
            <div
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 flex items-center whitespace-nowrap bg-white"
              style={{ overflow: "hidden" }}
            >
              <div className="animate-marquee-hover flex items-center shrink-0">
                <span className="text-[#c0862d] pr-8" style={{ fontWeight: 700, fontSize: "clamp(0.82rem, 2.5vw, 0.97rem)" }}>{name}</span>
                <span className="text-[#c0862d] pr-8" style={{ fontWeight: 700, fontSize: "clamp(0.82rem, 2.5vw, 0.97rem)" }}>{name}</span>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
          </div>
          <span
            className="text-[#ECB159] shrink-0"
            style={{ fontWeight: 800, fontSize: "clamp(0.82rem, 2.5vw, 0.95rem)" }}
          >
            {price}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-[#9e7c5a] mb-2 line-clamp-1" style={{ fontSize: "0.75rem" }}>
            {description}
          </p>
        )}

        {/* Tags + Cart — pushed to bottom */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`border rounded-full px-2 py-0.5 ${TAG_STYLES[tag] ?? "bg-[#f5ede0] text-[#7a5c3e] border-[#e8d9c8]"}`}
                style={{ fontSize: "0.7rem", fontWeight: 500 }}
              >
                {tag}
              </span>
            ))}
          </div>

          {!hideCart && (
            quantity > 0 ? (
              <div className="flex items-center gap-2 bg-[#fdf6ec] border border-[#e8d9c8] rounded-full p-0.5 shrink-0">
                <button
                  onClick={() => updateQuantity(id, -1)}
                  className="w-7 h-7 flex items-center justify-center text-[#7a5c3e] hover:bg-white rounded-full transition-colors active:scale-90"
                >
                  <Minus size={14} />
                </button>
                <span className="text-[#3d1f00] font-semibold text-sm w-4 text-center select-none">{quantity}</span>
                <button
                  onClick={() => updateQuantity(id, 1)}
                  className="w-7 h-7 flex items-center justify-center text-[#7a5c3e] hover:bg-white rounded-full transition-colors active:scale-90"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className={`min-w-[2rem] h-8 w-8 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm shrink-0 ${added
                  ? "bg-green-500"
                  : "bg-[#ECB159] hover:bg-[#d49a3d]"
                  }`}
                aria-label={`Add ${name} to cart`}
              >
                {added
                  ? <Check size={14} className="text-white" strokeWidth={3} />
                  : <ShoppingCart size={13} className="text-white" />
                }
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
