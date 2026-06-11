import { io } from "socket.io-client"
import { getAccessToken } from "./Api"

const base_url = import.meta.env.VITE_BACKEND || "https://unlucky-wqqqaa.amvera.io"

const connectSocket = (url: string) => {
    const socket = io(base_url + url, {
        auth: {
            token: getAccessToken()
        },
        transports: ["websocket"],
        timeout: 5000
    })

    return socket
}

export default connectSocket