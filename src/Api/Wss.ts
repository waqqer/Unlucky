import { io, type ManagerOptions, type SocketOptions } from "socket.io-client"
import { getSPUserToken } from "./Api"
import API_URL from "./Config"

const connectSocket = (url: string, config?: Partial<ManagerOptions & SocketOptions>) => {
    const socket = io(API_URL + url, {
        auth: {
            token: getSPUserToken()
        },
        transports: ["websocket"],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 3000,
        ...config
    })

    return socket
}

export default connectSocket
