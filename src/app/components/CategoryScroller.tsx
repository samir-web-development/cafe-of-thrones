import { useRef, useEffect } from "react";
import { motion } from "motion/react";

interface Category {
    name: string;
    emoji: string;
}

const CATEGORIES: Category[] = [
    { name: "Coffee", emoji: "☕" },
    { name: "Snacks", emoji: "🍿" },
    { name: "Burger", emoji: "🍔" },
    { name: "Pizza", emoji: "🍕" },
    { name: "Mocktail", emoji: "🥤" },
    { name: "Sandwich", emoji: "🥪" },
];

interface CategoryScrollerProps {
    /** Called when a category pill is clicked (optional) */
    onSelect?: (category: string) => void;
    /** Which category is currently active */
    active?: string;
    className?: string;
}

export function CategoryScroller({
    onSelect,
    active,
    className = "",
}: CategoryScrollerProps) {
    const pillRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    // Auto-scroll the active pill into view
    useEffect(() => {
        if (!active) return;
        const el = pillRefs.current.get(active);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
    }, [active]);

    return (
        <div
            className={`relative overflow-x-auto ${className}`}
            style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                userSelect: "none",
            }}
        >
            <div className="flex gap-2.5 py-1 px-1">
                {CATEGORIES.map((cat) => {
                    const isActive = active === cat.name;
                    return (
                        <motion.button
                            key={cat.name}
                            ref={(el) => {
                                if (el) pillRefs.current.set(cat.name, el);
                            }}
                            onClick={() => onSelect?.(cat.name)}
                            animate={{
                                scale: isActive ? 1.08 : 1,
                                backgroundColor: isActive ? "#ECB159" : "#ffffff",
                                borderColor: isActive ? "#ECB159" : "#e8d9c8",
                                color: isActive ? "#ffffff" : "#7a5c3e",
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                                mass: 0.8,
                            }}
                            className="shrink-0 flex items-center gap-1.5 rounded-full border font-semibold select-none
                                px-3.5 py-1.5 text-xs
                                sm:px-4 sm:py-2 sm:text-sm"
                            style={{
                                boxShadow: isActive
                                    ? "0 4px 14px rgba(236, 177, 89, 0.35)"
                                    : "0 1px 3px rgba(0,0,0,0.04)",
                            }}
                        >
                            <span className="text-base leading-none">{cat.emoji}</span>
                            {cat.name}
                        </motion.button>
                    );
                })}
            </div>

            {/* Hide scrollbar */}
            <style>{`
                .scrollbar-none::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
