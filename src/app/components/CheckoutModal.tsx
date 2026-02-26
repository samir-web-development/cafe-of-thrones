import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MapPin, Hash, User as UserIcon, Phone } from "lucide-react";
import { useCart, CartItem } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
    const { cartItems, cartTotal, setCartItems, setIsCartOpen } = useCart();
    const { user } = useAuth();

    const [orderType, setOrderType] = useState<"home_delivery" | "table_order">("home_delivery");
    const [customerName, setCustomerName] = useState(user?.user_metadata?.full_name || "");
    const [customerPhone, setCustomerPhone] = useState(user?.user_metadata?.phone_number || "");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [tableNumber, setTableNumber] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in to place an order.");
            return;
        }
        if (cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Create the Order securely
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    order_type: orderType,
                    status: 'pending',
                    customer_name: customerName,
                    customer_phone: customerPhone,
                    delivery_address: orderType === 'home_delivery' ? deliveryAddress : null,
                    table_number: orderType === 'table_order' ? tableNumber : null,
                    total_amount: cartTotal
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Prepare Order Items
            const orderItemsData = cartItems.map((item: CartItem) => {
                const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ""));
                return {
                    order_id: orderData.id,
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    unit_price: priceNum,
                    total_price: priceNum * item.quantity
                };
            });

            // 3. Insert Order Items securely
            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemsData);

            if (itemsError) throw itemsError;

            // Success cleanup
            setSuccess(true);
            setCartItems([]); // clear the local cart state

            setTimeout(() => {
                setSuccess(false);
                onClose();
                setIsCartOpen(false);
            }, 3000);

        } catch (err: any) {
            console.error("Order submission error:", err);
            setError(err.message || "Failed to process the order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#3d1f00]/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="h-24 bg-[#2a1500] relative flex items-center justify-center shrink-0">
                            <h2 className="text-2xl font-bold text-[#fdf6ec] relative z-10" style={{ letterSpacing: "1px" }}>
                                Finalize Order
                            </h2>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-[#fdf6ec]/80 hover:text-white transition-colors z-10 p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form Area */}
                        <div className="p-8 bg-[#fdf6ec] overflow-y-auto flex-1">
                            {success ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#3d1f00] mb-2">Order Confirmed!</h3>
                                    <p className="text-[#9e7c5a]">Your royal delicacies will be ready soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                                            {error}
                                        </div>
                                    )}

                                    {/* Order Type Toggle */}
                                    <div className="flex p-1 bg-white border border-[#e8d9c8] rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setOrderType("home_delivery")}
                                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${orderType === "home_delivery" ? "bg-[#3d1f00] text-white shadow-sm" : "text-[#9e7c5a] hover:text-[#3d1f00]"}`}
                                        >
                                            Home Delivery
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setOrderType("table_order")}
                                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${orderType === "table_order" ? "bg-[#3d1f00] text-white shadow-sm" : "text-[#9e7c5a] hover:text-[#3d1f00]"}`}
                                        >
                                            Table Order
                                        </button>
                                    </div>

                                    {/* Customer Details */}
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b09070]">
                                            <UserIcon size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Your Name"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full bg-white border border-[#e8d9c8] rounded-xl py-3 pl-11 pr-4 text-[#3d1f00] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#ECB159] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b09070]">
                                            <Phone size={20} />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="Phone Number"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            className="w-full bg-white border border-[#e8d9c8] rounded-xl py-3 pl-11 pr-4 text-[#3d1f00] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#ECB159] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Conditional Fields based on Order Type */}
                                    {orderType === "home_delivery" ? (
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b09070]">
                                                <MapPin size={20} />
                                            </div>
                                            <textarea
                                                required
                                                placeholder="Full Delivery Address"
                                                value={deliveryAddress}
                                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                                rows={2}
                                                className="w-full bg-white border border-[#e8d9c8] rounded-xl py-3 pl-11 pr-4 text-[#3d1f00] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#ECB159] focus:border-transparent transition-all resize-none"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b09070]">
                                                <Hash size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Table Number"
                                                value={tableNumber}
                                                onChange={(e) => setTableNumber(e.target.value)}
                                                className="w-full bg-white border border-[#e8d9c8] rounded-xl py-3 pl-11 pr-4 text-[#3d1f00] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#ECB159] focus:border-transparent transition-all"
                                            />
                                        </div>
                                    )}

                                    <div className="border-t border-[#e8d9c8] pt-4 mt-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[#7a5c3e] font-medium">Total Amount</span>
                                            <span className="text-[#3d1f00] font-bold text-xl">₹ {cartTotal}</span>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#ECB159] hover:bg-[#d49a3d] text-white py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? "Processing Order..." : "Place Order"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
