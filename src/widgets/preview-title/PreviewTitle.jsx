import styles from "./PreviewTitle.module.css"

const PreviewTitle = (props) => {

    const {
        title,
        desc,
        className,
        children
    } = props

    let f1 = title.slice(0, 2)
    let f2 = title.slice(2, title.length)

    return (
        <div className={`${className}`}>
            <h1 className={styles.title}>
                <span className={`${styles.firstHalf}`}>{f1}</span>
                <span className={`${styles.secondHalf}`}>{f2}</span>
            </h1>
            <p className={styles.titleDesc}>{desc}</p>
            {children}
        </div>
    )
}

export default PreviewTitle