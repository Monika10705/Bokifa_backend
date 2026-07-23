function InputField({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    className = "",
    disabled = false,
    required = false,
    autoComplete = "off",
    ...rest
}) {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition ${className}`}
            {...rest}
        />
    );
}

export default InputField;