import { io } from "socket.io-client"
import { getAccessToken } from "./Api"
import API_URL from "./Config"

const connectSocket = (url: string) => {
    const socket = io(API_URL + url, {
        auth: {
            token: getAccessToken()
        },
        transports: ["websocket"],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 3000
    })

    return socket
}

export default connectSocket