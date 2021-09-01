import Logger from '@ioc:Adonis/Core/Logger'
import Ws from 'App/Services/Ws'

Ws.boot()

Ws.io.on('connection', (socket) => {
  Logger.info(`connection -> ${socket.id}`)

  socket.on('chatList', (chats: string[]) => {
    chats.forEach((e) => {
      if (!socket.rooms.has(e)) socket.join(e)

      Logger.info(`${socket.id} join -> ${e}`)
    })
  })

  socket.on('sendMessage', (chat, message) => {
    Ws.io.to(chat).emit('newMessage', chat, message)

    Logger.info(`${socket.id} emit newMessage to -> ${chat}`)
  })
})
