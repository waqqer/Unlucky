import { Link } from "react-router"
import "./LinkButton.css"
import { memo } from "react"

const LinkButton = (props) => {
    const {
        link,
        title,
        children
    } = props

    return (
        <Link className="Button LinkButton" to={link}>{title} {children}</Link>
    )
}

export default memo(LinkButton)