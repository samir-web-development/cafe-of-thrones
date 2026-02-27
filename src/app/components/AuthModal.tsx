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

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin, // Redirects back to the app after login
                }
            });
            if (error) throw error;
            // Note: The page will automatically redirect to Google, so we don't call onClose() or setLoading(false) here.
        } catch (err: any) {
            setError(err.message || "An error occurred with Google Login.");
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

                            <div className="mt-8 relative flex items-center justify-center">
                                <hr className="w-full border-[#e8d9c8]" />
                                <span className="absolute bg-[#fdf6ec] px-4 text-[#b09070] text-xs font-bold uppercase tracking-wider">Or</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full mt-6 bg-white border border-[#e8d9c8] hover:bg-[#fcf8f2] text-[#3d1f00] py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    <path d="M1 1h22v22H1z" fill="none" />
                                </svg>
                                Continue with Google
                            </button>

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
