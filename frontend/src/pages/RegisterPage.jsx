import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import API_BASE_URL from "../config/api";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "name is required";
    if (!formData.email) newErrors.email = "email is required";
    if (!formData.password) newErrors.password = "password is required";
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.message });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setErrors({ submit: "server error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md bg-surface border border-border rounded-lg p-8">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Tasko</h1>
        <h2 className="text-xl font-semibold text-text mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} error={errors.name}/>

          <Input label="Email" type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} error={errors.email} />

          <Input label="Password" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password}/>

          {errors.submit && (
            <p className="text-sm text-white bg-danger bg-opacity-10 p-3 rounded">{errors.submit}</p>
          )}

          <Button type="submit" variant="primary" disabled={loading} className="w-full cursor-pointer">
            {loading ? "Loading..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-text-muted mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:text-primary-dark">Login</Link>
        </p>
      </div>
    </div>
  );
}