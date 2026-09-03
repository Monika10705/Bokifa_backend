import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { EmptyRow } from "./AdminTableHelpers";

function UsersTable({ users }) {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) =>
      [user.name, user.email]
        .some((value) => String(value || "").toLowerCase().includes(query)),
    );
  }, [users, search]);

  return (
    <div>
      <div className="flex justify-between items-center gap-4 mb-4">
        <h3 className="font-semibold text-gray-700">Users ({users.length})</h3>
        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <input
              type="search"
              placeholder="Search users..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 pl-9 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Read-only</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <EmptyRow cols={3} label="No users yet" />
              ) : filteredUsers.length === 0 ? (
                <EmptyRow cols={3} label="No users found" />
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[180px]">{user.email}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersTable;
