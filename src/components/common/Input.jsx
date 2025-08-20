export default function Input({ label, value, onChange, placeholder, type='text', required=false, ...rest }) {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label}{required && <span className="required">*</span>}</label>}
            <input
                type={type}
                className="input-field"
                value={value}
                onChange={(e)=>onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                {...rest}
            />
        </div>
    )
}

