import { IHandler } from "../../Shared/IHandler"
import { Handler as Deauth } from "./Deauth"
import { Socket, Server } from 'socket.io'
import { Logger } from "../../Shared/Logger"

export const Handler: IHandler<string, void> = {
    Handler: function(socket: Socket, server: Server) {
        return function disconnect(reason: string) {
            Logger.warn(`Disconnected [id=${socket?.id}]`)

            if (reason === 'transport close') { // Был подключен
                Logger.error(`Соединение потеряно`)
            }
            else if (reason === 'transport error') { // Не удалось подключиться
                Logger.error(`При соединении произошла ошибка`)
                return
            }
            else if (reason === 'client namespace disconnect') { // Был подключен
                Logger.error(`Клиент сам отключился`)
            }
            else if (reason === 'server namespace disconnect') { // Был подключен
                Logger.error(`Клиент принудительно отключен`)
            }
            else if (reason === 'ping timeout') { // Был подключен
                Logger.error(`Превышено время ожидания ответа`)
            }
            else if (reason === 'parse error' || reason === 'forced close') {
                Logger.error(`Соединение потеряно из-за поврежденого пакета`)
            }
            else if (reason === 'forced server close') {
                Logger.error(`Превышено время ожидания ответа и был принудительно отключен`)
                return
            }

            Deauth.Handler(socket)()
        }
    }
}