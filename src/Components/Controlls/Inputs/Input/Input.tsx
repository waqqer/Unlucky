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
            const maxValue = max ?? Number.POSITIVE_INFINITY

            if (isNaN(val)) {
                onChange?.("")
            } else if (val > maxValue) {
                onChange?.(maxValue.toString())
            } else {
                onChange?.(val.toString())
            }

            return
        }

        onChange?.(ev.target.value)
    }, [onChange, max, type])

    const handleBlur = useCallback(() => {
        if(type === "number") {
            const val = typeof value === "number" ? value : parseInt(value ?? "", 10)
            const minValue = min ?? Number.NEGATIVE_INFINITY
            const maxValue = max ?? Number.POSITIVE_INFINITY

            if(isNaN(val) && min !== undefined) {
                onChange?.(min.toString())
            } else if (val < minValue) {
                onChange?.(minValue.toString())
            } else if (val > maxValue) {
                onChange?.(maxValue.toString())
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
