import Encryption from '@ioc:Adonis/Core/Encryption'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Chat from 'App/Models/Chat'
import Message from 'App/Models/Message'

export default class MessagesController {
  public async store({ params, request, auth, response }: HttpContextContract) {
    const { chat_id: chatId } = params
    const id = Encryption.decrypt<number>(chatId)
    if (!id) return response.notFound('Chat not found')

    const { text } = await request.validate({
      schema: schema.create({
        text: schema.string(),
      }),
    })

    const chat = await Chat.query()
      .whereHas('users', (query) => {
        query.where('id', auth.user?.id!)
      })
      .where('id', id)
      .preload('users')
      .preload('messages', (preloadMessages) => {
        preloadMessages.preload('user')
      })
      .firstOrFail()

    const trx = await Database.transaction()

    try {
      const message = new Message().useTransaction(trx)
      chat.useTransaction(trx)
      auth.user?.useTransaction(trx)

      message.fill({
        text,
      })

      await Promise.all([
        chat?.related('messages').save(message),
        auth.user?.related('messages').save(message),
      ])

      await trx.commit()

      return chat
    } catch (error) {
      throw error
    }
  }
}
