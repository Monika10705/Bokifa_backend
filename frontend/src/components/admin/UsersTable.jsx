import { Section, TableHead, EmptyRow, RowActions } from "./AdminTableHelpers";

const COLUMNS = ["Name", "Email", "Created", "Actions"];

function UsersTable({ users, onAdd, onEdit, onDelete }) {
  return (
    <Section title="Users" count={users.length} onAdd={onAdd}>
      <table className="w-full text-sm">
        <TableHead columns={COLUMNS} />
        <tbody className="divide-y divide-gray-100">
          {users.length === 0 ? (
            <EmptyRow cols={4} label="No users yet" />
          ) : (
            users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <RowActions
                    onEdit={() => onEdit(user)}
                    onDelete={() => onDelete(user._id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Section>
  );
}

export default UsersTable;
