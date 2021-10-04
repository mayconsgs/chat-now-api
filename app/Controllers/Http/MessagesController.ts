import Encryption from '@ioc:Adonis/Core/Encryption'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Chat from 'App/Models/Chat'
import Message from 'App/Models/Message'
import { DateTime } from 'luxon'

export default class MessagesController {
  public async index({ params, request, response, auth }: HttpContextContract) {
    const { chat_id: chatId } = params
    const id = Encryption.decrypt<number>(chatId)
    if (!id) return response.unprocessableEntity('Invalid chat ID')
    const { page } = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
      }),
    })

    const chat = await Chat.query()
      .whereHas('users', (query) => {
        query.where('id', auth.user?.id!)
      })
      .where('id', id)
      .firstOrFail()

    const messages = await chat
      .related('messages')
      .query()
      .orderBy('createdAt', 'desc')
      .preload('user')
      .paginate(page || 1, 50)

    return messages.serialize({
      relations: {
        user: {
          fields: {
            pick: ['id', 'avatar', 'fullName'],
          },
        },
      },
    })
  }

  public async store({ params, request, auth, response }: HttpContextContract) {
    const { chat_id: chatId } = params
    const id = Encryption.decrypt<number>(chatId)
    if (!id) return response.unprocessableEntity('Invalid chat ID')

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
      .firstOrFail()

    const trx = await Database.transaction()

    try {
      chat.useTransaction(trx)
      const message = new Message()
        .fill({
          text,
        })
        .useTransaction(trx)

      await message.related('chat').associate(chat)
      await message.related('user').associate(auth.user!)
      await message.related('views').create({ userId: auth.user?.id })
      await chat.merge({ updatedAt: DateTime.now() }).save()
      await message.load('user')

      await trx.commit()

      return message.serialize({
        relations: {
          user: {
            fields: {
              pick: ['id', 'avatar', 'fullName'],
            },
          },
        },
      })
    } catch (error) {
      trx.rollback()
      throw error
    }
  }
}
