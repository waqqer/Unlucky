import type { Classable, Clickable, Identical } from "@/Shared/Types/PropsTypes"
import { memo, type HTMLInputTypeAttribute, type Ref } from "react"
import styles from "./Input.module.css"

interface UIInputProps extends Identical, Classable, Clickable {
    ref?: Ref<HTMLInputElement>
    type?: HTMLInputTypeAttribute
    onBlur?: () => void,
    title?: string
}

const Input = (props: UIInputProps) => {
    const {
        id = "",
        className = "",
        onClick,
        ref,
        type = "text",
        onBlur,
        title
    } = props

    return (
        <>
            <div className={styles["input-box"]}>
                <input
                    type={type}
                    ref={ref}
                    className={`${styles.input} ${className}`}
                    onClick={onClick}
                    placeholder=""
                    onBlur={onBlur}
                    id={id}
                />
                {title &&
                    <label htmlFor={id} className={styles.title}>
                        {title}
                    </label>
                }
            </div>
        </>
    )
}

export default memo(Input)