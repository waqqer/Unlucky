import "./Title.css"

const Title = (props) => {
    const {
        children
    } = props

    return (
        <div className="title-container">
            {children}
        </div>
    )
}

export default Title