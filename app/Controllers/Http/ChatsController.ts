import Encryption from '@ioc:Adonis/Core/Encryption'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Chat from 'App/Models/Chat'
export default class ChatsController {
  public async index({ auth }: HttpContextContract) {
    const chats = await Chat.query()
      .orderBy('updatedAt', 'desc')
      .preload('messages', (preloadMessages) => {
        preloadMessages.groupOrderBy('created_at', 'desc').groupLimit(1).preload('user')
      })
      .whereHas('users', (query) => {
        query.where('id', auth.user?.id!)
      })

    return chats.map((e) =>
      e.serialize({
        relations: {
          messages: {
            relations: {
              user: {
                fields: {
                  pick: ['id', 'avatar', 'fullName'],
                },
              },
            },
          },
        },
      })
    )
  }

  public async store({ request, auth }: HttpContextContract) {
    const { title, description } = await request.validate({
      schema: schema.create({
        title: schema.string(),
        description: schema.string(),
      }),
    })

    const trx = await Database.transaction()

    try {
      auth.user?.useTransaction(trx)
      const chat = new Chat()
        .fill({
          description,
          isGroup: true,
          title,
        })
        .useTransaction(trx)

      await auth.user!.related('chats').save(chat)
      chat.shareCode = Encryption.encrypt(chat.id)
      await chat.save()

      await trx.commit()

      return chat
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  public async show({ params, response, auth }: HttpContextContract) {
    const { id: chatId } = params
    const id = Encryption.decrypt<number>(chatId)
    if (!id) return response.notFound('Chat not found')

    const chat = await Chat.query()
      .whereHas('users', (query) => {
        query.where('id', auth.user?.id!)
      })
      .where('id', id)
      .preload('users')
      .preload('messages', (preloadMessages) => {
        preloadMessages.orderBy('createdAt', 'desc').preload('user')
      })
      .firstOrFail()

    await Promise.all(
      chat.messages.map((e) => {
        if (e.userId === auth.user?.id) {
          return e.load('views')
        }
      })
    )

    return chat.serialize({
      relations: {
        users: {
          fields: {
            pick: ['id', 'avatar', 'fullName'],
          },
        },
        messages: {
          relations: {
            user: {
              fields: {
                pick: ['id', 'avatar', 'fullName'],
              },
            },
          },
        },
      },
    })
  }

  public async join({ auth, params }: HttpContextContract) {
    const { id: encryptId } = params
    const id = Encryption.decrypt<number>(encryptId)

    const chat = await Chat.findOrFail(id)

    await chat.related('users').save(auth.user!)
    await chat.load('users')

    return chat
  }

  public async visualize({ params, auth, response }: HttpContextContract) {
    const { id: encryptId } = params
    const id = Encryption.decrypt<number>(encryptId)

    if (!id) return response.notFound('Chat not found')

    const chat = await Chat.query()
      .whereHas('users', (query) => {
        query.where('id', auth.user?.id!)
      })
      .where('id', id)
      .firstOrFail()

    const messages = await chat
      .related('messages')
      .query()
      .whereDoesntHave('views', (query) => {
        query.whereHas('user', (query) => {
          query.where('user_id', auth.user?.id!)
        })
      })

    await Promise.all(
      messages.map((mess) =>
        mess.related('views').create({
          userId: auth.user?.id!,
        })
      )
    )

    return response.noContent()
  }
}
