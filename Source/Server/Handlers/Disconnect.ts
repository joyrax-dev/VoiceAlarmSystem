import { IHandler } from "../../Shared/IHandler"
import { Handler as Deauth } from "./Deauth"
import { Socket } from 'socket.io'

export const Handler: IHandler<string, void> = {
    Handler: function(socket: Socket) {
        return function disconnect(reason: string) {
            console.log(`Disconnected [id=${socket.id}]`)

            if (reason === 'transport close') { // Был подключен
                console.log(`Соединение потеряно`)
            }
            else if (reason === 'transport error') { // Не удалось подключиться
                console.log(`При соединении произошла ошибка`)
                return
            }
            else if (reason === 'client namespace disconnect') { // Был подключен
                console.log(`Клиент сам отключился`)
            }
            else if (reason === 'server namespace disconnect') { // Был подключен
                console.log(`Клиент принудительно отключен`)
            }
            else if (reason === 'ping timeout') { // Был подключен
                console.log(`Превышено время ожидания ответа`)
            }
            else if (reason === 'parse error' || reason === 'forced close') {
                console.log(`Соединение потеряно из-за поврежденого пакета`)
            }
            else if (reason === 'forced server close') {
                console.log(`Превышено время ожидания ответа и был принудительно отключен`)
                return
            }

            Deauth.Handler(socket)()
        }
    }
}