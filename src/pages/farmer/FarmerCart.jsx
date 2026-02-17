import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getCart,
  updateCart,
  removeCartItem,
  placeOrder
} from "../../api/farmerApi";
// SaaS Icons
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const FarmerCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      setCart(res.data);
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    
    try {
      await updateCart({ productId, quantity: newQty });
      fetchCart();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleRemove = async (productId) => {
    if (!window.confirm("Remove this item from your cart?")) return;
    try {
      await removeCartItem({ productId });
      fetchCart();
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      await placeOrder();
      alert("Order placed successfully! 🌾");
      fetchCart();
    } catch (error) {
      console.error("Order error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShoppingCart className="text-green-600" /> Review Your Cart
            </h1>
            <p className="text-slate-500 mt-1">Finalize your items before placing the order.</p>
          </div>
          <Link to="/farmer/store" className="hidden md:flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {loading && !cart ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">Syncing your cart...</p>
          </div>
        ) : !cart || cart.items?.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <ShoppingCart size={32} className="text-slate-200" />
            </div>
            <h3 className="text-slate-800 font-bold text-xl">Your cart is empty</h3>
            <p className="text-slate-400 text-sm mb-8">Looks like you haven't added any agri-inputs yet.</p>
            <Link to="/farmer/store" className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-100 transition-all active:scale-95">
              Explore Agri Store
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 🔹 Left: Item List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6 group">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                       <ShoppingCart size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">{item.productName}</h3>
                      <p className="text-sm font-black text-green-600">₹{item.price} <span className="text-[10px] text-slate-400 font-medium">/ unit</span></p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                        className="p-1.5 hover:bg-white hover:text-green-600 rounded-lg transition-all text-slate-500"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold text-slate-700">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                        className="p-1.5 hover:bg-white hover:text-green-600 rounded-lg transition-all text-slate-500"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Subtotal</p>
                       <p className="font-black text-slate-900">₹{item.price * item.quantity}</p>
                    </div>

                    <button 
                      onClick={() => handleRemove(item.productId)}
                      className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔹 Right: Checkout Summary (4 cols) */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Items Total</span>
                    <span className="text-white font-bold">₹{cart.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Delivery Charge</span>
                    <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest mt-1">Free</span>
                  </div>
                  <div className="h-[1px] bg-slate-800 my-4" />
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 font-medium">Grand Total</span>
                    <span className="text-3xl font-black text-white">₹{cart.totalAmount}</span>
                  </div>
                </div>

                <button 
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="w-full bg-green-500 hover:bg-green-400 text-slate-900 font-black py-4 rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-green-500/20 flex items-center justify-center gap-2 mb-6"
                >
                  {isProcessing ? "Processing..." : "Confirm & Place Order"}
                  {!isProcessing && <CreditCard size={18} />}
                </button>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <ShieldCheck className="text-emerald-400" size={24} />
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Secure transaction powered by <span className="text-white font-bold">AgriSmart Pay</span>. 
                    Quality guaranteed inputs delivered to your farm.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FarmerCart;