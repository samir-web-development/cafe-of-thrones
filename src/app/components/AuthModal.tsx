import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Phone, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import OtpInput from 'react-otp-input';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type AuthStep = 'PHONE_INPUT' | 'OTP_INPUT' | 'PROFILE_COMPLETION';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [step, setStep] = useState<AuthStep>('PHONE_INPUT');
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Format phone number string for basic validation (+91 default if none provided)
    const formatPhoneForSupabase = (number: string) => {
        const clean = number.replace(/\D/g, '');
        if (clean.length === 10) return `+91${clean}`;
        if (!number.startsWith('+')) return `+${clean}`;
        return number;
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formattedPhone = formatPhoneForSupabase(phone);
            const { error } = await supabase.auth.signInWithOtp({
                phone: formattedPhone,
            });
            if (error) throw error;
            setStep('OTP_INPUT');
        } catch (err: any) {
            setError(err.message || "Failed to send OTP to this number.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("Please enter the 6-digit code.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formattedPhone = formatPhoneForSupabase(phone);
            const { data, error } = await supabase.auth.verifyOtp({
                phone: formattedPhone,
                token: otp,
                type: 'sms',
            });

            if (error) throw error;

            // Wait a brief moment for the trigger to insert the profile
            await new Promise(resolve => setTimeout(resolve, 500));

            // Check if profile exists and has the placeholder name
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', data.user?.id)
                .single();

            if (!profile?.full_name || profile.full_name.trim() === '') {
                // Must complete profile
                setStep('PROFILE_COMPLETION');
            } else {
                // Return user to browsing
                resetAndClose();
            }

        } catch (err: any) {
            setError(err.message || "Invalid OTP code.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication failed during profile save.");

            // Update their name to overwrite the placeholder
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Apply the welcome reward 
            const { error: rewardError } = await supabase
                .from('profiles')
                .update({ loyalty_points: 50, welcome_reward_given: true })
                .eq('id', user.id)
                .eq('welcome_reward_given', false); // Ensure only applied if false

            // We silently ignore rewardError so it doesn't block them if something weird happens with points

            resetAndClose();
        } catch (err: any) {
            setError(err.message || "Could not save your profile. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setStep('PHONE_INPUT');
        setPhone("");
        setOtp("");
        setFullName("");
        setError(null);
        onClose();
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
                        onClick={() => {
                            if (step !== 'PROFILE_COMPLETION') resetAndClose();
                        }}
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
                                {step === 'PROFILE_COMPLETION' ? 'Welcome to Cafe' : 'Login / Register'}
                            </h2>
                            {step !== 'PROFILE_COMPLETION' && (
                                <button
                                    onClick={resetAndClose}
                                    className="absolute top-4 right-4 text-[#fdf6ec]/80 hover:text-white transition-colors z-10 p-1"
                                >
                                    <X size={24} />
                                </button>
                            )}
                        </div>

                        {/* Form Area */}
                        <div className="p-8 bg-[#fdf6ec]">
                            {error && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {/* --- STEP 1: PHONE INPUT --- */}
                            {step === 'PHONE_INPUT' && (
                                <form onSubmit={handleSendOTP} className="flex flex-col gap-5">
                                    <div className="text-center mb-2 text-[#7a5c3e] text-sm">
                                        Enter your mobile number to receive an active code.
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b09070]">
                                            <Phone size={20} />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="e.g. 9876543210"
                                            className="w-full bg-white border border-[#e8d9c8] rounded-xl py-3 pl-11 pr-4 text-[#3d1f00] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#ECB159] focus:border-transparent transition-all tracking-wide font-medium"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || phone.length < 10}
                                        className="w-full bg-[#ECB159] hover:bg-[#d49a3d] text-white py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] shadow-sm mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Sending OTP..." : "Get OTP"}
                                    </button>
                                </form>
                            )}

                            {/* --- STEP 2: OTP VERIFICATION --- */}
                            {step === 'OTP_INPUT' && (
                                <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
                                    <div className="text-center text-[#7a5c3e] text-sm">
                                        We sent a 6-digit code to <span className="font-bold text-[#3d1f00]">{phone}</span>
                                    </div>

                                    <div className="flex justify-center">
                                        <OtpInput
                                            value={otp}
                                            onChange={setOtp}
                                            numInputs={6}
                                            renderSeparator={<span className="w-2"></span>}
                                            renderInput={(props) => (
                                                <input
                                                    {...props}
                                                    style={{ width: "45px" }}
                                                    className="h-12 border border-[#e8d9c8] bg-white rounded-lg text-center font-bold text-xl text-[#3d1f00] focus:outline-none focus:ring-2 focus:ring-[#ECB159]"
                                                />
                                            )}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || otp.length < 6}
                                        className="w-full bg-[#ECB159] hover:bg-[#d49a3d] text-white py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] shadow-sm mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <ShieldCheck size={20} />
                                        {loading ? "Verifying..." : "Verify & Login"}
                                    </button>

                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => { setStep('PHONE_INPUT'); setOtp(''); setError(null); }}
                                        className="text-[#7a5c3e] text-sm font-semibold hover:text-[#3d1f00] text-center"
                                    >
                                        Edit phone number
                                    </button>
                                </form>
                            )}

                            {/* --- STEP 3: PROFILE COMPLETION --- */}
                            {step === 'PROFILE_COMPLETION' && (
                                <form onSubmit={handleCompleteProfile} className="flex flex-col gap-5">
                                    <div className="text-center mb-4">
                                        <h3 className="text-lg font-bold text-[#3d1f00] mb-2">You're almost done!</h3>
                                        <p className="text-[#7a5c3e] text-sm">
                                            What should we call you? Completing your profile unlocks your <strong className="text-[#ECB159]">first order discount</strong>.
                                        </p>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Your Full Name"
                                            className="w-full bg-white border border-[#e8d9c8] rounded-xl py-3 px-4 text-[#3d1f00] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#ECB159] focus:border-transparent transition-all font-medium text-center"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || fullName.trim().length < 2}
                                        className="w-full bg-[#3d1f00] hover:bg-[#2a1500] text-white py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] shadow-sm mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Saving..." : "Save My Name"}
                                    </button>
                                </form>
                            )}

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
