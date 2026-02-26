import { useState, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { CategoryScroller } from "../components/CategoryScroller";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthModal } from "../components/AuthModal";
import { CheckoutModal } from "../components/CheckoutModal";

// Categorize items
const categories = [
    "Snacks",
    "Sandwich",
    "Burger",
    "Pizza",
    "Coffee",
    "Mocktail",
];

export function MenuPage() {
    const { cartItems, updateQuantity, cartTotal, setIsCartOpen } = useCart();
    const { products, loading } = useProducts();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState("");

    // Auth & Checkout state
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    const handleProceedToCheckout = () => {
        if (!user) {
            // User is NOT logged in. Show AuthModal so they can login/signup.
            setIsAuthModalOpen(true);
        } else {
            // User IS logged in. Show CheckoutModal to finalize order.
            setIsCheckoutModalOpen(true);
        }
    };

    // Map database results to format MenuPage expects
    const mappedProducts = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: `₹ ${p.price}`,
        rating: p.rating || 0,
        image: p.image_url || "",
        tags: p.tags || [],
        description: p.description || undefined
    }));

    // Auto-scroll to a category if navigated here with state
    useEffect(() => {
        const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
        if (scrollTo) {
            setActiveCategory(scrollTo.charAt(0).toUpperCase() + scrollTo.slice(1));
            setTimeout(() => {
                const el = document.getElementById(scrollTo);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
        }
    }, []);

    const handleCategorySelect = (category: string) => {
        setActiveCategory(category);
        const el = document.getElementById(category.toLowerCase());
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        // Clear active after a moment so it doesn't stay highlighted forever
        setTimeout(() => setActiveCategory(""), 1200);
    };

    return (
        <div className="bg-[#fdf6ec] min-h-screen py-8 md:py-16 relative">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8 items-start">

                {/* Main Menu Area */}
                <div className="flex-1 w-full lg:max-w-[calc(100%-350px)] xl:max-w-[calc(100%-400px)]">
                    {/* Back Button — icon on mobile, text on desktop */}
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                        className="group flex items-center gap-2 mb-6 transition-colors"
                    >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#e8d9c8] text-[#7a5c3e] group-hover:bg-[#f5ede0] transition-colors shrink-0">
                            <ArrowLeft size={15} />
                        </span>
                        <span className="hidden sm:inline text-[#b09070] group-hover:text-[#7a5c3e] text-sm font-medium transition-colors">Back</span>
                    </button>

                    <h1
                        className="text-[#2a1500] text-4xl md:text-5xl font-bold mb-4 md:mb-8 text-center lg:text-left"
                        style={{ letterSpacing: "-1px" }}
                    >
                        Our Full Menu
                    </h1>
                    <p className="text-center lg:text-left text-[#9e7c5a] max-w-2xl lg:mx-0 mx-auto mb-8 md:mb-12">
                        Explore our complete selection of royal delicacies. From crispy snacks to
                        rich coffees, find your new favorite.
                    </p>

                    {/* Sticky Category Scroller */}
                    <div className="sticky top-20 z-20 bg-[#fdf6ec]/90 backdrop-blur-sm py-3 -mx-4 px-4 mb-10 md:mb-16 border-b border-[#eedfc6]/60">
                        <CategoryScroller
                            active={activeCategory}
                            onSelect={handleCategorySelect}
                        />
                    </div>

                    <div className="flex flex-col gap-16 md:gap-24">
                        {loading ? (
                            <div className="py-20 text-center text-[#9e7c5a]">Fetching the full menu...</div>
                        ) : categories.map((category) => {
                            const itemsInCategory = mappedProducts.filter((item: any) =>
                                item.tags.includes(category)
                            );

                            if (itemsInCategory.length === 0) return null;

                            return (
                                <section key={category} id={category.toLowerCase()} className="scroll-mt-24">
                                    <div className="flex items-center gap-4 mb-8">
                                        <h2 className="text-3xl font-bold text-[#3d1f00]">{category}</h2>
                                        <div className="h-px bg-[#e8d9c8] flex-1 mt-2"></div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                        {itemsInCategory.map((item: any, index: number) => (
                                            <motion.div
                                                key={item.id}
                                                className="h-full block" // block is critical to render grid items correctly without messing up flex layouts in ProductCard
                                                initial={{ opacity: 0, y: 15 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: "-50px" }}
                                                transition={{ duration: 0.4, delay: index * 0.05 }}
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
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </div>

                {/* Persistent Sidebar Cart (Desktop Only) */}
                <aside className="hidden lg:flex w-[350px] xl:w-[400px] flex-col bg-white rounded-2xl border border-[#e8d9c8] shadow-sm sticky top-28 h-[calc(100vh-140px)] overflow-hidden">
                    <div className="p-6 border-b border-[#e8d9c8] bg-[#fdf6ec]">
                        <h2 className="text-[#3d1f00] text-xl font-bold flex items-center justify-between">
                            Your Order
                            <span className="bg-[#ECB159] text-white text-xs px-2.5 py-1 rounded-full font-bold">
                                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                            </span>
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-[#9e7c5a] opacity-60">
                                <span className="mb-2">🛒</span>
                                <p className="text-sm">Your cart is empty.</p>
                                <p className="text-xs mt-1">Add items from the menu to get started!</p>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-[#f0e4d4] bg-[#fdf6ec]/30">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#e8d9c8] bg-white">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1 py-0.5">
                                        <h4 className="font-bold text-[#3d1f00] text-sm leading-tight line-clamp-2">{item.name}</h4>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-[#ECB159] font-bold text-sm">{item.price}</div>
                                            <div className="flex items-center gap-1.5 bg-white border border-[#e8d9c8] rounded-full p-0.5 shadow-sm">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-[#7a5c3e] hover:bg-[#fdf6ec] rounded-full transition-colors">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-[#3d1f00] font-semibold text-xs w-4 text-center select-none">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-[#7a5c3e] hover:bg-[#fdf6ec] rounded-full transition-colors">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="p-6 border-t border-[#e8d9c8] bg-white mt-auto">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[#7a5c3e] font-medium">Subtotal</span>
                                <span className="text-[#3d1f00] font-bold text-xl">₹ {cartTotal}</span>
                            </div>
                            <button
                                onClick={handleProceedToCheckout}
                                className="w-full bg-[#ECB159] hover:bg-[#d49a3d] text-white py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    )}
                </aside>

                {/* Mobile Floating Cart Summary */}
                {cartItems.length > 0 && (
                    <div className="lg:hidden fixed bottom-4 left-3 right-3 z-40">
                        <motion.button
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            onClick={() => setIsCartOpen(true)}
                            className="w-full bg-white rounded-2xl px-4 py-3 shadow-2xl shadow-[#d4a96040] flex items-center justify-between active:scale-[0.98] transition-transform border border-[#eddfc8]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-[#fdf6ec] border border-[#eddfc8] w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-[#3d1f00]">
                                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-[#b09070] font-medium leading-none mb-0.5">Your Order</p>
                                    <p className="text-[#3d1f00] font-bold text-sm">₹ {cartTotal}</p>
                                </div>
                            </div>
                            <div className="bg-[#ECB159] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
                                View Cart →
                            </div>
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
            />
        </div>
    );
}
