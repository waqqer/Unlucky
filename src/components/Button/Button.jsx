import "./Button.css"

const Button = (props) => {
    const {
        className,
        onClick,
        type = "button",
        isDisabled = false,
        children
    } = props

    return (
        <button 
            className={`button ${className}`} 
            type={type} 
            onClick={onClick}
            disabled={isDisabled}
        > 
            {children} 
        </button>
    )
}

export default Button