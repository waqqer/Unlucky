import { Link } from "react-router"
import "./LinkButton.css"

const LinkButton = (props) => {
    const {
        className,
        onClick,
        to = "/",
        children,
        target
    } = props

    return (
        <Link 
            className={`link-button ${className}`} 
            onClick={onClick}
            to={to}
            target={target}
        > 
            {children} 
        </Link>
    )
}

export default LinkButton