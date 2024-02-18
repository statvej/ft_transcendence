import { io, Socket } from "socket.io-client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { AuthContext } from "./AuthProvider";
import { UserDataContext } from "./UserDataProvider";

export const SocketContext = createContext<Socket | null>(null);

interface socketProviderProps {
    children: ReactNode;
}

export function SocketProvider(props: socketProviderProps): JSX.Element {
    const { validToken, userId } = useContext(AuthContext);
    const { updateUserData } = useContext(UserDataContext);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        function connectSocket() {
            console.log("Connecting socket for userId:", userId);
            const newSocket = io(backendUrl.base, {
                query: {
                    userId: userId,
                },
            });
            setSocket(newSocket);
            return newSocket;
        }

        function disconnectSocket(socket: Socket) {
            console.log("Disconnecting socket for userId:", userId);
            socket.disconnect();
        }

        if (validToken && !socket) {
            const newSocket = connectSocket();
            newSocket.on("socialUpdate", updateUserData);
            newSocket.onAny((event, ...args) => {
                console.log("socket event:", event, args);
            });

            return () => {
                newSocket.off("socialUpdate", updateUserData);
                newSocket.offAny();
                disconnectSocket(newSocket);
            };
        } else if (!validToken && socket) {
            disconnectSocket(socket);
            setSocket(null);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validToken, userId]);

    return (
        <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
    );
}
