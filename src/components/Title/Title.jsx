const ErrorTitle = (props) => {
    const {
        title,
        desc,
        children
    } = props

    return (
        <div>
            <h1 className="title">{title}</h1>

            <p className="desc">{desc}</p>

            {children}
        </div>
    )
}

export default ErrorTitle