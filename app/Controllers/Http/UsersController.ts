import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request }: HttpContextContract) {
    const { avatar, ...userData } = await request.validate({
      schema: schema.create({
        firstName: schema.string(),
        lastName: schema.string.optional(),
        bio: schema.string.optional(),
        email: schema.string({}, [rules.email()]),
        password: schema.string({}, [rules.minLength(8)]),
        avatar: schema.file.optional({
          extnames: ['png', 'jpg', 'jpeg'],
          size: '2MP',
        }),
      }),
    })

    const user = await User.create({
      ...userData,
    })

    return user.serialize()
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params

    const user = await User.findOrFail(id)
    await user.load('chats')

    return user?.serialize({
      relations: {
        chats: {
          fields: {
            omit: ['shareCode'],
          },
        },
      },
    })
  }
}
