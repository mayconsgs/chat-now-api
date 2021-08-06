import Encryption from '@ioc:Adonis/Core/Encryption'
import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request }: HttpContextContract) {
    const { password, avatar, ...userData } = await request.validate({
      schema: schema.create({
        firstName: schema.string(),
        lastName: schema.string.optional(),
        bio: schema.string.optional(),
        email: schema.string({}, [rules.email()]),
        password: schema.string(),
        avatar: schema.file.optional({
          extnames: ['png', 'jpg', 'jpeg'],
          size: '2MP',
        }),
      }),
    })

    const user = new User()

    await user
      .fill({
        ...userData,
        passwordHash: await Hash.make(password),
        shareCode: Encryption.encrypt(user.id),
      })
      .save()

    return user.toJSON()
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params

    const user = await User.findOrFail(id)

    return user?.toJSON()
  }
}
