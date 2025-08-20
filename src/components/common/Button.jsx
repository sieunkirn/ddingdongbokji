export default function Button({ children, onClick, disabled=false, variant='primary', size='large', className='' }) {
    const cls = `btn btn--${variant} btn--${size} ${disabled ? 'btn--disabled' : ''} ${className}`
    return (
        <button className={cls} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}
