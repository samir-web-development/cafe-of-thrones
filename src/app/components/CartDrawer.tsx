import { useCart } from "../context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "./ui/sheet";
import { ChevronLeft, Plus, Minus, Trash2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../context/AuthContext";
import { AuthModal } from "./AuthModal";
import { CheckoutModal } from "./CheckoutModal";
import { useState } from "react";

export function CartDrawer() {
    const {
        isCartOpen,
        setIsCartOpen,
        cartItems,
        updateQuantity,
        removeFromCart,
        cartTotal
    } = useCart();
    const { user } = useAuth();

    // Auth & Checkout state
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    const handleProceedToCheckout = () => {
        if (!user) {
            setIsAuthModalOpen(true);
        } else {
            setIsCheckoutModalOpen(true);
        }
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent side="right" className="w-full sm:max-w-md bg-[#fdf6ec] flex flex-col p-0 border-[#e8d9c8]">
                <SheetHeader className="p-4 sm:p-6 border-b border-[#e8d9c8] sticky top-0 bg-[#fdf6ec] z-10 flex flex-row items-center gap-3 justify-start">
                    {/* Mobile back arrow */}
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#e8d9c8] text-[#7a5c3e] hover:bg-[#f5ede0] transition-colors shrink-0"
                        aria-label="Close cart"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <SheetTitle className="text-[#3d1f00] text-xl font-bold flex items-center gap-2 m-0 mt-0 pt-0">
                        Your Cart
                        <span className="bg-[#ECB159] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-[#9e7c5a] opacity-70">
                            <span className="text-4xl mb-4">🛒</span>
                            <p>Your cart is empty.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4 text-[#ECB159] font-medium hover:underline"
                            >
                                Continue browsing
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border border-[#e8d9c8] shadow-sm relative group">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#f5ede0] shrink-0">
                                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex flex-col flex-1 justify-between">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-[#2a1500] font-semibold text-sm line-clamp-2 pr-6">{item.name}</h4>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="absolute top-3 right-3 text-[#c49b71] hover:text-red-500 transition-colors p-1"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="text-[#ECB159] font-bold text-sm">{item.price}</div>

                                        <div className="flex items-center gap-2 bg-[#fdf6ec] border border-[#e8d9c8] rounded-full p-0.5">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-6 h-6 flex items-center justify-center text-[#7a5c3e] hover:bg-white rounded-full transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-[#3d1f00] font-semibold text-sm w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-6 h-6 flex items-center justify-center text-[#7a5c3e] hover:bg-white rounded-full transition-colors"
                                            >
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
                    <SheetFooter className="p-4 sm:p-6 border-t border-[#e8d9c8] bg-white mt-auto flex-col gap-4">
                        <div className="flex items-center justify-between w-full mb-2">
                            <span className="text-[#7a5c3e] font-medium">Total Amount</span>
                            <span className="text-[#3d1f00] font-bold text-xl">₹ {cartTotal}</span>
                        </div>
                        <button
                            onClick={handleProceedToCheckout}
                            className="w-full bg-[#ECB159] hover:bg-[#d49a3d] text-white py-3 rounded-xl font-bold transition-colors active:scale-[0.98] shadow-sm"
                        >
                            Proceed to Checkout
                        </button>
                    </SheetFooter>
                )}
            </SheetContent>

            {/* Modals placed outside the SheetContent but still within the component */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
            />
        </Sheet>
    );
}
