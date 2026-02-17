import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllUsers, verifyUser, blockUser } from "../../api/adminApi";
import { Search, UserCheck, UserX, ShieldCheck, Mail, Filter, MoreVertical } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, verified) => {
    await verifyUser({ userId, verified });
    fetchUsers();
  };

  const handleBlock = async (userId, active) => {
    await blockUser({ userId, active });
    fetchUsers();
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
            <p className="text-slate-500 text-sm mt-1">Manage, verify, and monitor the AgriSmart community.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 outline-none w-64 transition-all shadow-sm"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">User Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Platform Role</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Verification</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Account Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-green-100 to-green-50 text-green-700 flex items-center justify-center font-bold border border-green-200">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-none mb-1">{user.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 italic"><Mail size={12} /> {user.email || "No email"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 capitalize">
                        {user.role.replace('ROLE_', '').toLowerCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {user.verified ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 w-fit px-2.5 py-1 rounded-full border border-emerald-100">
                          <ShieldCheck size={14} /> Verified
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold bg-amber-50 w-fit px-2.5 py-1 rounded-full border border-amber-100">
                          Pending
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {user.active ? (
                        <span className="flex items-center gap-1.5 text-blue-600 text-xs font-bold">
                          <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-pulse" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold italic">
                           Blocked
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {!user.verified && (
                          <button
                            onClick={() => handleVerify(user.id, true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm shadow-green-200 flex items-center gap-1"
                          >
                            <UserCheck size={14} /> Verify
                          </button>
                        )}

                        <button
                          onClick={() => handleBlock(user.id, !user.active)}
                          className={`p-2 rounded-lg transition-all ${
                            user.active 
                              ? "text-slate-400 hover:text-red-600 hover:bg-red-50" 
                              : "text-blue-600 hover:bg-blue-50"
                          }`}
                          title={user.active ? "Block User" : "Unblock User"}
                        >
                          {user.active ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                        
                        <button className="p-2 text-slate-400 hover:text-slate-600">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && users.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Search size={32} />
              </div>
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;