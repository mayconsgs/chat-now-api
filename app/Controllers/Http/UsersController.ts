import { cuid } from '@ioc:Adonis/Core/Helpers'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import fs from 'fs'
import supabase from 'Services/supabase'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
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

      await supabase.storage.from('avatars').upload(path, fs.createReadStream(avatar.tmpPath!))
      const { publicURL } = supabase.storage.from('avatars').getPublicUrl(path)
      user.avatarUrl = publicURL
      await user.save()
    }

    return response.redirect('/login')
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
