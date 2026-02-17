import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyOrders } from "../../api/farmerApi";
// SaaS Icons
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Calendar, 
  ChevronDown, 
  Loader2,
  Box
} from "lucide-react";

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      setOrders(res.data || []);
    } catch (error) {
      console.error("Orders fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case "PLACED":
        return { color: "text-amber-600 bg-amber-50 border-amber-100", icon: <Clock size={14} />, progress: 1 };
      case "SHIPPED":
        return { color: "text-blue-600 bg-blue-50 border-blue-100", icon: <Truck size={14} />, progress: 2 };
      case "DELIVERED":
        return { color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <CheckCircle2 size={14} />, progress: 3 };
      default:
        return { color: "text-slate-500 bg-slate-50 border-slate-100", icon: <Package size={14} />, progress: 0 };
    }
  };

  const stages = [
    { label: "Placed", icon: Package },
    { label: "Shipped", icon: Truck },
    { label: "Delivered", icon: CheckCircle2 }
  ];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Box className="text-green-600" /> Procurement History
          </h1>
          <p className="text-slate-500 mt-1">Track your orders for seeds, equipment, and farm supplies.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">Fetching your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Package size={32} className="text-slate-200" />
            </div>
            <h3 className="text-slate-800 font-bold text-xl">No orders found</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">Your supply orders will appear here once you make a purchase from the store.</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl">
            {orders.map((order) => {
              const config = getStatusConfig(order.status);
              return (
                <div key={order.orderId} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                  
                  {/* Card Header */}
                  <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Reference</span>
                        <span className="text-sm font-black text-slate-900">#{order.orderId}</span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar size={12} /> Ordered on {new Date().toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Bill</p>
                        <p className="text-xl font-black text-slate-900 flex items-center gap-0.5">
                          <IndianRupee size={16} className="text-slate-400" /> {order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.color}`}>
                        {config.icon} {order.status}
                      </div>
                    </div>
                  </div>

                  {/* 🔹 Interactive Tracker */}
                  <div className="px-8 pt-10 pb-6 relative">
                    <div className="flex justify-between relative">
                      {/* Background Line */}
                      <div className="absolute top-4 left-0 w-full h-1 bg-slate-100 rounded-full -translate-y-1/2" />
                      {/* Progress Line */}
                      <div 
                        className="absolute top-4 left-0 h-1 bg-green-500 rounded-full -translate-y-1/2 transition-all duration-1000 ease-out" 
                        style={{ width: `${((config.progress - 1) / (stages.length - 1)) * 100}%` }}
                      />

                      {stages.map((stage, idx) => {
                        const isDone = idx + 1 <= config.progress;
                        const isCurrent = idx + 1 === config.progress;
                        return (
                          <div key={idx} className="flex flex-col items-center relative z-10">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                              isDone ? 'bg-green-600 border-white text-white shadow-lg' : 'bg-white border-slate-100 text-slate-300'
                            } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                              {isDone ? <CheckCircle2 size={16} /> : <stage.icon size={16} />}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest mt-3 ${isDone ? 'text-slate-900' : 'text-slate-300'}`}>
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 🔹 Items Accordion Style */}
                  <div className="px-8 pb-8 pt-4">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ChevronDown size={14} /> Consignment Manifest ({order.items.length} items)
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex justify-between items-center text-sm">
                            <span className="font-bold text-slate-700">{item.productName}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-slate-400 font-medium">Qty: {item.quantity}</span>
                              <span className="font-black text-slate-900 w-20 text-right">₹{(item.quantity * item.price).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FarmerOrders;