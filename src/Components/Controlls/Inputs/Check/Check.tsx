import { memo, useCallback, useRef, useEffect} from "react"
import styles from "./Check.module.css"
import type { Classable, Identical, Parent } from "@/Shared/Types/PropsTypes"

interface UICheckProps extends Classable, Identical, Parent {
    onChange?: (value: boolean) => void
    checked?: boolean
    isDisabled?: boolean
}

const Check = (props: UICheckProps) => {
    const {
        className = "",
        id = "",
        children,
        onChange,
        checked,
        isDisabled = false
    } = props

    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }, [])

    const handleChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(ev.target.checked)
        }
    }, [onChange])

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.checked = checked
        }
    }, [checked])

    return (
        <div
            className={`${styles.checker} ${checked && styles.active} ${className}`}
            onClick={handleClick}
            style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
        >
            <input
                type="checkbox"
                id={id}
                checked={checked}
                ref={inputRef}
                onChange={handleChange}
                disabled={isDisabled}
            />
            {children}
        </div>
    )
}

export default memo(Check)