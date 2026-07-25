import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

import InputField from "../components/InputField";
import Button from "../components/Button";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
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

        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            return toast.error("Please fill all fields");
        }

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {
            const response = await api.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            toast.success(response.data.message);

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            navigate("/login");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Registration failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Full Name
                        </label>

                        <InputField
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
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

                    <div className="space-y-2">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>

                        <InputField
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        text="Register"
                    />

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-green-600 font-medium hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;