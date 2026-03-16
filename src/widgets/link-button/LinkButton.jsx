import { Link } from "react-router"
import "./LinkButton.css"

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

export default LinkButton