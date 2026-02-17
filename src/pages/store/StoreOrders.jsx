import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { shipOrder, deliverOrder } from "../../api/StoreOwnerApi";
import axiosInstance from "../../api/axiosInstance";
// SaaS Icons
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Box, 
  ClipboardList, 
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";

const StoreOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/orders/store");
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShip = async (id) => {
    try {
      setProcessingId(id);
      await shipOrder(id);
      fetchOrders();
    } catch (error) {
      console.error("Ship error:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeliver = async (id) => {
    try {
      setProcessingId(id);
      await deliverOrder(id);
      fetchOrders();
    } catch (error) {
      console.error("Deliver error:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case "PLACED":
        return { color: "text-amber-600 bg-amber-50 border-amber-100", icon: <Clock size={14} /> };
      case "SHIPPED":
        return { color: "text-blue-600 bg-blue-50 border-blue-100", icon: <Truck size={14} /> };
      case "DELIVERED":
        return { color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <CheckCircle2 size={14} /> };
      default:
        return { color: "text-slate-500 bg-slate-50 border-slate-100", icon: <Package size={14} /> };
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* Header & Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ClipboardList className="text-green-600" /> Fulfillment Center
            </h1>
            <p className="text-slate-500 mt-1">Manage and track outgoing store shipments for your customers.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To Process</p>
              <p className="text-xl font-black text-amber-600">{orders.filter(o => o.status === 'PLACED').length}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In Transit</p>
              <p className="text-xl font-black text-blue-600">{orders.filter(o => o.status === 'SHIPPED').length}</p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">Loading manifest...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Package size={32} className="text-slate-200" />
            </div>
            <h3 className="text-slate-800 font-bold text-xl">No active orders</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">Check back later when farmers make purchases from your store.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const config = getStatusStyles(order.status);
              const isProcessing = processingId === order.orderId;

              return (
                <div key={order.orderId} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  
                  {/* Card Header */}
                  <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/50">
                    <div className="flex gap-4 items-center">
                      <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
                        <Box size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reference ID</span>
                          <span className="text-sm font-black text-slate-900">#{order.orderId}</span>
                        </div>
                        <p className="text-xl font-black text-slate-900 flex items-center gap-1">
                          <IndianRupee size={16} className="text-slate-400" /> {order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                      <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.color}`}>
                        {config.icon} {order.status}
                      </div>

                      <div className="flex gap-2 w-full md:w-auto">
                        {order.status === "PLACED" && (
                          <button
                            onClick={() => handleShip(order.orderId)}
                            disabled={isProcessing}
                            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                          >
                            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
                            Ship Order
                          </button>
                        )}

                        {order.status === "SHIPPED" && (
                          <button
                            onClick={() => handleDeliver(order.orderId)}
                            disabled={isProcessing}
                            className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                          >
                            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Packing Manifest */}
                  <div className="px-8 py-6 border-t border-slate-50">
                    <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Package size={14} /> Packing Slip ({order.items.length} items)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm border-b md:border-b-0 border-slate-100 pb-2 md:pb-0">
                            <span className="font-bold text-slate-700 truncate mr-4">{item.productName}</span>
                            <span className="bg-white border border-slate-200 text-slate-500 font-black px-2 py-0.5 rounded text-xs min-w-[2.5rem] text-center">
                              × {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Decoration */}
                  <div className={`h-1.5 w-full ${
                    order.status === 'PLACED' ? 'bg-amber-400' : 
                    order.status === 'SHIPPED' ? 'bg-blue-500' : 'bg-emerald-500'
                  } opacity-30`} />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 p-6 bg-slate-100 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row items-center gap-4">
           <div className="bg-white p-3 rounded-2xl text-slate-400 shadow-sm border border-slate-200">
              <AlertCircle size={24} />
           </div>
           <div>
              <p className="font-bold text-slate-700">Logistics Policy</p>
              <p className="text-xs text-slate-500 font-medium">Please ensure physical inventory matches the manifest before marking an order as Shipped. Once delivered, payments will be processed within 24 hours.</p>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoreOrders;