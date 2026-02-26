import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Clock, CheckCircle2, Package, MapPin, Phone, User as UserIcon, RefreshCcw } from "lucide-react";

// The allowed admin email
const ADMIN_EMAIL = "samirgunjite26@gmail.com";

export function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Check if user is the admin
    if (!authLoading && user?.email !== ADMIN_EMAIL) {
        return <Navigate to="/" replace />;
    }

    // 2. Fetch Orders on mount
    useEffect(() => {
        if (!user || user.email !== ADMIN_EMAIL) return;

        fetchOrders();

        // 3. Set up REALTIME subscription for new orders
        const ordersSubscription = supabase
            .channel('public:orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
            .subscribe();

        return () => {
            supabase.removeChannel(ordersSubscription);
        };
    }, [user]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Fetch orders and their nested items
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          order_items (*)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            // Optimistic upate or rely on realtime
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#fdf6ec] flex items-center justify-center">
                <div className="text-[#9e7c5a] animate-pulse flex flex-col items-center gap-4">
                    <RefreshCcw className="animate-spin" size={32} />
                    <p>Loading Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdf6ec] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#3d1f00] font-serif tracking-wide">CAFE COMMAND CENTER</h1>
                        <p className="text-[#9e7c5a] mt-1">Live Order Management Dashboard</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full border border-[#e8d9c8] shadow-sm flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-bold text-[#3d1f00]">System Online</span>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white border border-[#e8d9c8] rounded-2xl p-12 text-center flex flex-col items-center">
                        <Package size={48} className="text-[#d0b89b] mb-4" />
                        <h3 className="text-xl font-bold text-[#3d1f00]">No Orders Yet</h3>
                        <p className="text-[#9e7c5a] mt-2">When a customer places an order, it will appear here instantly.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white border border-[#e8d9c8] rounded-2xl overflow-hidden shadow-sm flex flex-col">

                                {/* Card Header Status Line */}
                                <div className={`h-2 w-full ${order.status === 'pending' ? 'bg-red-400' :
                                    order.status === 'preparing' ? 'bg-yellow-400' :
                                        order.status === 'out_for_delivery' ? 'bg-blue-400' :
                                            order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-400'
                                    }`} />

                                <div className="p-5 flex-1 flex flex-col">
                                    {/* Order ID & Type */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-xs font-mono text-[#b09070]">#{order.id.split('-')[0].toUpperCase()}</span>
                                            <div className="mt-1">
                                                <span className="bg-[#f5ede0] text-[#7a5c3e] text-xs px-2 py-1 rounded font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                                                    {order.order_type === 'home_delivery' ? <Package size={12} /> : null}
                                                    {order.order_type.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-bold text-[#3d1f00]">₹{order.total_amount}</span>
                                        </div>
                                    </div>

                                    {/* Customer Details */}
                                    <div className="bg-[#fcfaf5] rounded-xl p-3 border border-[#f0e4d4] mb-4 space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-[#3d1f00]">
                                            <UserIcon size={14} className="text-[#b09070]" />
                                            <span className="font-semibold">{order.customer_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#5c4228]">
                                            <Phone size={14} className="text-[#b09070]" />
                                            <a href={`tel:${order.customer_phone}`} className="hover:underline hover:text-[#ECB159]">{order.customer_phone}</a>
                                        </div>
                                        {order.order_type === 'table_order' && order.table_number && (
                                            <div className="flex items-center gap-2 text-sm text-[#5c4228]">
                                                <span className="w-3.5 h-3.5 rounded-full bg-[#3d1f00] text-white flex items-center justify-center text-[8px] font-bold">#</span>
                                                <span className="font-bold">Table {order.table_number}</span>
                                            </div>
                                        )}
                                        {order.order_type === 'home_delivery' && order.delivery_address && (
                                            <div className="flex items-start gap-2 text-sm text-[#5c4228]">
                                                <MapPin size={14} className="text-[#b09070] shrink-0 mt-0.5" />
                                                <span className="line-clamp-2">{order.delivery_address}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Items */}
                                    <div className="flex-1">
                                        <h4 className="text-xs font-bold text-[#9e7c5a] uppercase tracking-wide mb-2">Order Items</h4>
                                        <ul className="space-y-2 divide-y divide-[#f0e4d4]">
                                            {(order.order_items || []).map((item: any) => (
                                                <li key={item.id} className="pt-2 first:pt-0 flex justify-between items-start text-sm">
                                                    <div className="flex gap-2">
                                                        <span className="font-bold text-[#3d1f00]">{item.quantity}x</span>
                                                        <span className="text-[#5c4228]">{item.product_name}</span>
                                                    </div>
                                                    <span className="text-[#9e7c5a] whitespace-nowrap ml-2">₹{item.total_price}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 pt-4 border-t border-[#e8d9c8] flex flex-wrap gap-2">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                className="flex-1 bg-[#ECB159] hover:bg-[#d49a3d] text-white py-2 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2"
                                            >
                                                <Clock size={16} /> Accept & Prepare
                                            </button>
                                        )}

                                        {order.status === 'preparing' && order.order_type === 'home_delivery' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2"
                                            >
                                                <Package size={16} /> Out for Delivery
                                            </button>
                                        )}

                                        {(order.status === 'preparing' && order.order_type === 'table_order') || order.status === 'out_for_delivery' ? (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2"
                                            >
                                                <CheckCircle2 size={16} /> Mark Completed
                                            </button>
                                        ) : null}

                                        {order.status === 'delivered' && (
                                            <div className="flex-1 bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg font-bold text-sm flex justify-center items-center gap-2">
                                                <CheckCircle2 size={16} /> Order Completed
                                            </div>
                                        )}

                                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                className="px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-semibold text-sm transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
