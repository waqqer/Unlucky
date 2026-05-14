import { useRef, useEffect } from "react"

const useSyncRefs = (...values) => {
    const refs = useRef(values.map((v) => ({ current: v })))
    useEffect(() => {
        values.forEach((v, i) => {
            refs.current[i].current = v
        })
    }, [values])
    return refs.current
}

export default useSyncRefs