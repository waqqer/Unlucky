import type { Classable, Clickable, Identical } from "@/Shared/Types/PropsTypes"
import { memo, type HTMLInputTypeAttribute, type Ref, useCallback } from "react"
import styles from "./Input.module.css"

interface UIInputProps extends Identical, Classable, Clickable {
    ref?: Ref<HTMLInputElement>
    type?: HTMLInputTypeAttribute
    onBlur?: () => void
    title?: string
    value?: string | number
    min?: number
    max?: number
    onChange?: (value: string) => void
    name?: string
}

const Input = (props: UIInputProps) => {
    const {
        id = "",
        className = "",
        onClick,
        ref,
        type = "text",
        onBlur,
        title,
        value,
        min,
        max,
        onChange,
        name
    } = props

    const handleChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        if (type === "number") {
            if (ev.target.value === "") {
                onChange?.("")
                return
            }

            const val = parseInt(ev.target.value, 10)

            if (isNaN(val)) {
                onChange("")
            } else if (val > max) {
                onChange(max.toString())
            } else {
                onChange(val.toString())
            }
        }
    }, [onChange, max, type])

    const handleBlur = useCallback(() => {
        if(type === "number") {
            const val = typeof value === "number" ? value : parseInt(value, 10)

            if(isNaN(val) || val < min) {
                onChange?.(min.toString())
            } else if (val > max) {
                onChange?.(max.toString())
            }
        }

        onBlur?.()
    }, [type, value, max, min, onChange, onBlur])

    return (
        <>
            <div className={styles["input-box"]}>
                <input
                    type={type}
                    ref={ref}
                    className={`${styles.input} ${className}`}
                    onClick={onClick}
                    onChange={handleChange}
                    placeholder=""
                    onBlur={handleBlur}
                    id={id}
                    value={value}
                    min={min}
                    max={max}
                    name={name}
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