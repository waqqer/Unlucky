import { Link } from "react-router"
import "./LinkButton.css"

const LinkButton = (props) => {
    const {
        className,
        onClick,
        to = "/",
        children
    } = props

    return (
        <Link 
            className={`link-button ${className}`} 
            onClick={onClick}
            to={to}
        > 
            {children} 
        </Link>
    )
}

export default LinkButton