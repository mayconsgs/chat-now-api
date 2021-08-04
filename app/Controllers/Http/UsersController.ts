import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { UserModel } from 'App/Database/Models/UserModel'

export default class UsersController {
  public async index({}: HttpContextContract) {
    return ''
  }

  public async store({ request }: HttpContextContract) {
    const { avatar, ...userData } = await request.validate({
      schema: schema.create({
        firstName: schema.string(),
        lastName: schema.string.optional(),
        email: schema.string({}, [rules.email()]),
        password: schema.string({}, [rules.minLength(8)]),
        avatar: schema.file.optional({
          extnames: ['png', 'jpg', 'jpeg'],
          size: '2MP',
        }),
      }),
    })

    const user = new UserModel(userData)
    await user.validate()
    const iserted = await user.save()
    return iserted
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params
    const user = await UserModel.findById(id)

    return user
  }

  public async update({}: HttpContextContract) {
    return ''
  }

  public async destroy({}: HttpContextContract) {
    return ''
  }
}
