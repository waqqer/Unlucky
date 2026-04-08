import styles from "./ReelsContainer.module.css"

const ReelsContainer = (props) => {
    const {
        className = "",
        children
    } = props

    return (
        <div className={`${styles["reels-container"]} ${className}`}>
            {children}
        </div>
    )
}

export default ReelsContainer
