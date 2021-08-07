/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

Route.post('login', async ({ auth, request, response }) => {
  const { rememberMe, email, password } = await request.validate({
    schema: schema.create({
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [rules.minLength(8)]),
      rememberMe: schema.boolean.optional(),
    }),
  })

  try {
    const user = await auth.use('web').attempt(email, password, rememberMe)

    return user
  } catch (err) {
    return response.badRequest('Invalid credentials')
  }
})

Route.resource('users', 'UsersController').only(['store', 'show'])
Route.resource('chats', 'ChatsController').only(['store', 'show'])
