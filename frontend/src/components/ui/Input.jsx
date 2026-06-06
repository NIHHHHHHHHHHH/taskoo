import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  error = "",
  label = "",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text mb-2">{label}</label>
      )}
      <div className="relative">
        <input type={isPassword && showPassword ? "text" : type} name={name} placeholder={placeholder} value={value} onChange={onChange}
          className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-text placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer absolute right-3 top-2 text-text-muted hover:text-text">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-danger mt-1">{error}</p>
      )}
    </div>
  );
}