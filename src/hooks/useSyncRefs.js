import { useRef } from "react"

const useSyncRefs = (...values) => {
    const refs = useRef(values.map(() => ({ current: undefined })))
    refs.current.forEach((ref, i) => { ref.current = values[i] })
    return refs.current
}

export default useSyncRefs