import styles from "./Title.module.css"

const Title = (props) => {
    const {
        className = "",
        children
    } = props

    return (
        <div className={`${styles["title-container"]} ${className}`}>
            {children}
        </div>
    )
}

export default Title