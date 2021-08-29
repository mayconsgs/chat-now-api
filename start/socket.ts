import Ws from 'App/Services/Ws'
Ws.boot()

interface NewMessageEventProps {
  chat: string
  message: object
}

Ws.io.on('connection', (socket) => {
  console.log(socket.id)

  socket.on('sendNewMessage', ({ chat, message }: NewMessageEventProps) => {
    Ws.io.in(chat).emit('receiveMessage', message)
  })
})
