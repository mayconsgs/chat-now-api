import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Chat from 'App/Models/Chat'
export default class ChatsController {
  public async store({ request, auth }: HttpContextContract) {
    const user = await auth.authenticate()

    const { title, description } = await request.validate({
      schema: schema.create({
        title: schema.string(),
        description: schema.string(),
      }),
    })

    const chat = new Chat().fill({
      description,
      isGroup: true,
      title,
    })

    await user.related('chats').save(chat)

    return chat.serialize()
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params

    const chat = await Chat.findOrFail(id)

    return chat
  }
}
