import { Link } from "react-router"
import "./LinkButton.css"

const LinkButton = (props) => {
    const {
        link,
        title
    } = props

    return (
        <div className="Button Link-Button">
            <Link to={link}>{title}</Link>
        </div>
    )
}

export default LinkButton