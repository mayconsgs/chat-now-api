import Ws from 'App/Services/Ws'
Ws.boot()

Ws.io.on('connection', (socket) => {
  socket.on('chatList', (chats: string[]) => {
    chats.forEach((e) => {
      if (!socket.rooms.has(e)) socket.join(e)
    })

    console.log(socket.rooms)
  })

  socket.on('sendMessage', (chat, message) => {
    socket.to(chat).emit('newMessage', chat, message)
  })
})
