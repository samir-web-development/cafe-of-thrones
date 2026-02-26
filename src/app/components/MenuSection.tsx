import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ProductCard } from "./ProductCard";
import { Flame, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CategoryScroller } from "./CategoryScroller";
import { Link } from "react-router-dom";

interface MenuItem {
    id: number;
    name: string;
    price: string;
    rating: number;
    image: string;
    tags: string[];
    description?: string;
}

interface MenuSectionProps {
    items: MenuItem[];
}

const TABS = [
    "All",
    "Burger",
    "Pizza",
    "Coffee",
    "Mocktail",
    "Snacks",
    "Sandwich",
];

// Cycle order for the slow looping animation
const CYCLE_TABS = ["Coffee", "Snacks", "Burger", "Pizza", "Mocktail", "Sandwich"];
const CYCLE_INTERVAL = 6000; // 6 seconds — slow, luxurious pace
const USER_PAUSE_DURATION = 10000; // Pause 10s after user interaction

export function MenuSection({ items }: MenuSectionProps) {
    const [activeTab, setActiveTab] = useState("Coffee");
    const [showAll, setShowAll] = useState(false);

    const cycleIndexRef = useRef(0);
    const userInteractedRef = useRef(false);
    const userTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Filter items based on tab and limit
    const filtered = useMemo(() => {
        let result: MenuItem[] = [];

        if (activeTab === "All") {
            const categoriesSeen = new Set<string>();
            for (const item of items) {
                for (const tag of item.tags) {
                    if (!categoriesSeen.has(tag)) {
                        categoriesSeen.add(tag);
                        if (!result.some(i => i.id === item.id)) {
                            result.push(item);
                        }
                    }
                }
            }
            for (const item of items) {
                if (!result.some(i => i.id === item.id)) {
                    result.push(item);
                }
            }
        } else {
            result = items.filter((item) => item.tags.includes(activeTab));
        }

        return showAll ? result : result.slice(0, 6);
    }, [items, activeTab, showAll]);

    const totalItemsInCurrentTab = useMemo(() => {
        if (activeTab === "All") return items.length;
        return items.filter((item) => item.tags.includes(activeTab)).length;
    }, [items, activeTab]);

    // Handle user manually selecting a category
    const handleTabChange = useCallback((tab: string) => {
        // Pause the auto-cycle when user interacts
        userInteractedRef.current = true;
        if (userTimerRef.current) clearTimeout(userTimerRef.current);
        userTimerRef.current = setTimeout(() => {
            userInteractedRef.current = false;
            // Sync cycle index to current tab so it continues from here
            const idx = CYCLE_TABS.indexOf(tab);
            if (idx !== -1) cycleIndexRef.current = idx;
        }, USER_PAUSE_DURATION);

        setActiveTab(tab);
        setShowAll(false);
    }, []);

    // Slow auto-cycle through categories in a loop
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            if (userInteractedRef.current) return;
            cycleIndexRef.current = (cycleIndexRef.current + 1) % CYCLE_TABS.length;
            const nextTab = CYCLE_TABS[cycleIndexRef.current];
            setActiveTab(nextTab);
            setShowAll(false);
        }, CYCLE_INTERVAL);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (userTimerRef.current) clearTimeout(userTimerRef.current);
        };
    }, []);

    return (
        <section
            id="menu"
            className="bg-[#fdf6ec] relative overflow-hidden py-12 md:py-20"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="mb-6 md:mb-8 flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2
                                className="text-[#2a1500]"
                                style={{
                                    fontSize: "clamp(1.3rem, 4vw, 2rem)",
                                    fontWeight: 800,
                                }}
                            >
                                Popular Now
                            </h2>
                            <Flame size={22} className="text-[#ECB159]" />
                        </div>
                        <p
                            className="text-[#9e7c5a]"
                            style={{ fontSize: "0.88rem" }}
                        >
                            Handpicked favourites loved by our royal customers
                        </p>
                    </div>
                    <Link
                        to="/menu"
                        className="group flex items-center gap-1 text-[#c0862d] border border-[#e8d9c8] rounded-full px-2.5 py-0.5 hover:bg-[#ECB159] hover:text-white hover:border-[#ECB159] transition-all duration-200 active:scale-95 shrink-0 mb-1"
                        style={{ fontSize: "0.72rem", fontWeight: 600 }}
                    >
                        View Menu
                        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Category Scroller — synced with auto-cycle */}
                <CategoryScroller
                    active={activeTab}
                    onSelect={(cat) => {
                        if (TABS.includes(cat)) handleTabChange(cat);
                    }}
                    className="mb-6 md:mb-8"
                />

                {/* Product Grid — smooth fade+slide-up with staggered card reveals */}
                <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                        <motion.div
                            key="empty"
                            className="text-center py-16 text-[#9e7c5a]"
                            style={{ fontSize: "0.95rem" }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            No items in this category yet. Check back soon!
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab + String(showAll)}
                            className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {filtered.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className="h-full"
                                    initial={{ opacity: 0, y: 28, scale: 0.94 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.07,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    }}
                                >
                                    <ProductCard
                                        id={item.id}
                                        name={item.name}
                                        price={item.price}
                                        rating={item.rating}
                                        image={item.image}
                                        tags={item.tags}
                                        description={item.description}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* View More Button */}
                {totalItemsInCurrentTab > 6 && (
                    <div className="mt-8 md:mt-12 flex justify-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="group flex items-center justify-center gap-2 text-[#c0862d] font-bold text-[1.05rem] hover:text-[#ECB159] transition-colors active:scale-95"
                        >
                            {showAll ? (
                                <>
                                    Show Less <ChevronUp size={22} className="group-hover:-translate-y-1 transition-transform" />
                                </>
                            ) : (
                                <>
                                    View Full Menu <ChevronDown size={22} className="group-hover:translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
