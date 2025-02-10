function InputField({ 
    label, 
    name, 
    value, 
    onChange, 
    type = 'text',
    className = '',
    error 
}) {
    return (
        <div className={`input-group ${className}`}>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                type={type}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
            />
            {error && <span className="error">{error}</span>}
        </div>
    );
} 

export default InputField;