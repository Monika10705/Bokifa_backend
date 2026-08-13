import { useState } from "react";
import Button from "./Button";

function UserForm({ initial, onSubmit, onClose, isEdit }) {
  const [form, setForm] = useState(initial);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      {!isEdit && (
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button type="submit" className="flex-1 !py-2 text-sm font-medium">
          Save
        </Button>
        <Button type="button" onClick={onClose} className="flex-1 !py-2 !bg-white border border-gray-300 !text-gray-700 text-sm hover:!bg-gray-50">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default UserForm;
