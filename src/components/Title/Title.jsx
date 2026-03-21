import "./Title.css"

const Title = (props) => {
    const {
        className,
        children
    } = props

    return (
        <div className={`title-container ${className}`}>
            {children}
        </div>
    )
}

export default Title