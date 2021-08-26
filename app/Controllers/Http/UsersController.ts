import { cuid } from '@ioc:Adonis/Core/Helpers'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import fs from 'fs'
import supabase from 'Services/supabase'

export default class UsersController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { password, avatar, ...userData } = await request.validate({
      schema: schema.create({
        firstName: schema.string(),
        lastName: schema.string.optional(),
        bio: schema.string.optional(),
        email: schema.string({}, [rules.email()]),
        password: schema.string({}, [rules.minLength(8)]),
        avatar: schema.file.optional({
          extnames: ['png', 'jpg', 'jpeg'],
        }),
      }),
    })

    const user = await User.create({
      ...userData,
      password,
    })

    if (avatar) {
      const fileName = `${cuid()}.${avatar.extname}`
      const path = `public/${fileName}`

      const bucket = supabase.storage.from('avatars')
      await bucket.upload(path, fs.createReadStream(avatar.tmpPath!))
      const { publicURL } = bucket.getPublicUrl(path)

      user.avatarUrl = publicURL
      await user.save()
    }

    const userAuth = await auth.use('web').attempt(user.email, password)
    return response.created(userAuth)
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params

    const user = await User.findOrFail(id)

    return user
  }

  public async getMe({ auth }: HttpContextContract) {
    return auth.user
  }
}
