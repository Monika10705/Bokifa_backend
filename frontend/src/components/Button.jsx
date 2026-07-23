function Button({
  type = "button",
  text,
  onClick,
  className = "",
  disabled = false,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
      className={`w-full bg-green-600 text-white py-3 rounded-lg cursor-pointer font-semibold hover:bg-green-700 transition disabled:opacity-50 ${className}`}
      {...rest}
    >
      {children || text}
    </button>
  );
}

export default Button;