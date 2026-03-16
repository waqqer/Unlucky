import { memo } from "react"
import "./ErrorMessage.css"

const ErrorMessage = (props) => {
    const {
        title,
        desc,
        children,
        className
    } = props

    return (
        <div className={`ErrorMessage ${className}`}>
            <i className="fa-solid fa-circle-exclamation ErrorIcon"></i>
            <h1 className="Error ErrorTitle">{title}</h1>
            <p className="Error ErrorDesc">{desc}</p>
            {children}
        </div>
    )
}

export default memo(ErrorMessage)