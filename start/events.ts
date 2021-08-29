import Event from '@ioc:Adonis/Core/Event'
import Chat from 'App/Models/Chat'
import Ws from 'App/Services/Ws'

Event.on('new:message', async (chatId: number) => {
  const chat = await Chat.find(chatId)
  if (!chat) return

  await chat?.load('users')

  chat.users.map((user) => {
    Ws.io.of(user.id).emit('updateList')
  })
})
