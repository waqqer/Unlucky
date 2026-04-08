import styles from "./AdminInfoBlock.module.css"

const AdminInfoBlock = (props) => {
    const {
        children,
        className = ""
    } = props

    return (
        <div className={`${styles.info} ${className}`}>
            {children}
        </div>
    )
}

export default AdminInfoBlock