
export default function RadioGroup({ label, options, value, onChange, name, required=false }) {
    return (
        <div className="radio-group">
            {label && <label className="input-label">{label}{required && <span className="required">*</span>}</label>}
            <div className="radio-options">
                {options.map(opt => (
                    <button
                        key={String(opt.value)}
                        type="button"
                        className={`radio-button ${value === opt.value ? 'radio-button--active' : ''}`}
                        onClick={()=>onChange(opt.value)}
                        aria-pressed={value === opt.value}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
