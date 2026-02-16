import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllUsers, verifyUser, blockUser } from "../../api/adminApi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
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
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Manage Users
        </h1>

        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Verified</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 capitalize">
                    {user.role}
                  </td>

                  <td className="px-6 py-4">
                    {user.verified ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Verified
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        Not Verified
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {user.active ? (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        Blocked
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center space-x-2">
                    {!user.verified && (
                      <button
                        onClick={() => handleVerify(user.id, true)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm"
                      >
                        Verify
                      </button>
                    )}

                    {user.active ? (
                      <button
                        onClick={() => handleBlock(user.id, false)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(user.id, true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No users found
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
