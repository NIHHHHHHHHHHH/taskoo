export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  type = "button",
}) {
  const variants = {
    primary: "px-4 py-2 rounded-lg font-medium bg-primary hover:bg-primary-dark text-white disabled:opacity-50",
    secondary: "px-4 py-2 rounded-lg font-medium bg-surface-light hover:bg-border text-text disabled:opacity-50",
    danger: "px-4 py-2 rounded-lg font-medium bg-danger hover:bg-red-600 text-white disabled:opacity-50",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${variants[variant]} ${className}`}>{children}</button>
  );
}