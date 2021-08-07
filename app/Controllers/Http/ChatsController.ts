import Encryption from '@ioc:Adonis/Core/Encryption'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Chat from 'App/Models/Chat'
export default class ChatsController {
  public async index({ auth }: HttpContextContract) {
    const chats = Chat.query().whereHas('users', (query) => {
      query.where('id', auth.user?.id!)
    })

    return chats
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
      const chat = new Chat()
        .fill({
          description,
          isGroup: true,
          title,
        })
        .useTransaction(trx)

      auth.user?.useTransaction(trx)
      chat.useTransaction(trx)

      await auth.user!.related('chats').save(chat)
      chat.shareCode = Encryption.encrypt(chat.id)
      await chat.save()

      await trx.commit()

      return chat
    } catch (error) {
      throw error
    }
  }

  public show({ params }: HttpContextContract) {
    const { id: encryptId } = params
    const id = Encryption.decrypt<number>(encryptId)

    return Chat.findOrFail(id)
  }
}
