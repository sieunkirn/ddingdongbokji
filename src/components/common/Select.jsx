
import { useState } from 'react'
export default function Select({ label, options=[], value, onChange, placeholder='선택', required=false }) {
    const [open, setOpen] = useState(false)
    const handleSelect = (val) => { onChange(val); setOpen(false) }
    return (
        <div className="select-group">
            {label && <label className="input-label">{label}{required && <span className="required">*</span>}</label>}
            <div className="select-wrapper">
                <button type="button" className="select-trigger" onClick={()=>setOpen(v=>!v)}>
                    <span>{value || placeholder}</span>
                    <span className="select-arrow">▼</span>
                </button>
                {open && (
                    <div className="select-dropdown">
                        {options.map(op => (
                            <button key={op} className={`select-option ${value===op ? 'select-option--selected':''}`} onClick={()=>handleSelect(op)}>
                                {op}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
