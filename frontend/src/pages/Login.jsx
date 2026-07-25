import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

import InputField from "../components/InputField";
import Button from "../components/Button";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        role: "user",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            return toast.error("Please fill all fields");
        }

        try {
            const response = await api.post("/auth/login", formData);

            toast.success(response.data.message);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.data.role);

            if (response.data.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="space-y-2">
                        <label
                            htmlFor="role"
                            className="text-sm font-medium text-gray-700"
                        >
                            Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <InputField
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <InputField
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        text="Login"
                    />

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-green-600 font-medium hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;