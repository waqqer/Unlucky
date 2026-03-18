const ErrorTitle = (props) => {
    const {
        title,
        desc,
        children
    } = props

    return (
        <div>
            <h1>{title}</h1>

            <p>{desc}</p>

            {children}
        </div>
    )
}

export default ErrorTitle