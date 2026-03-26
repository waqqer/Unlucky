import styles from "./AdminInfoBlock.module.css"

const AdminInfoBlock = (props) => {
    const {
        children
    } = props

    return (
        <div className={styles.info}>
            {children}
        </div>
    )
}

export default AdminInfoBlock