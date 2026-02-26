import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User as UserIcon } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset state when mode switches
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError(null);
        setPassword("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onClose(); // Close modal on success
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                // Supabase signup sometimes requires email confirmation depending on settings
                // For now we assume success means we can close or tell user to check email
                onClose();
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication.");
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
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header Image Area */}
                        <div className="h-32 bg-[#2a1500] relative flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
                            <h2 className="text-3xl font-bold text-[#fdf6ec] relative z-10" style={{ letterSpacing: "1px" }}>
                                {isLogin ? "Welcome Back" : "Join the Cafe"}
                            </h2>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-[#fdf6ec]/80 hover:text-white transition-colors z-10 p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form Area */}
                        <div className="p-8 bg-[#fdf6ec]">
                            {error && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                {!isLogin && (
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b09070]">
                                            <UserIcon size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Full Name"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full bg-white border border-[#e8d9c8] rounded-xl py-3 pl-11 pr-4 text-[#3d1f00] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#ECB159] focus:border-transparent transition-all"
                                        />
                                    </div>
                                )}

                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b09070]">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white border border-[#e8d9c8] rounded-xl py-3 pl-11 pr-4 text-[#3d1f00] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#ECB159] focus:border-transparent transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b09070]">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white border border-[#e8d9c8] rounded-xl py-3 pl-11 pr-4 text-[#3d1f00] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#ECB159] focus:border-transparent transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#ECB159] hover:bg-[#d49a3d] text-white py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] shadow-sm mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-[#9e7c5a] text-sm">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                    <button
                                        onClick={toggleMode}
                                        type="button"
                                        className="font-bold text-[#7a5c3e] hover:text-[#3d1f00] transition-colors"
                                    >
                                        {isLogin ? "Sign Up" : "Log In"}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
