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

Route.post('logout', async ({ auth, response }) => {
  if (auth.use('web').viaRemember) {
    await auth.use('web').logout(true)
  } else {
    await auth.use('web').logout()
  }
  return response.noContent()
})

Route.group(() => {
  Route.get('users/me', 'UsersController.getMe')
  Route.resource('users', 'UsersController').only(['show'])
  Route.resource('chats', 'ChatsController').apiOnly().except(['destroy', 'update'])
  Route.patch('chats/:id/join', 'ChatsController.join')
  Route.patch('chats/:id/visualize', 'ChatsController.visualize')
  Route.resource('chats.messages', 'MessagesController').only(['store', 'index'])
}).middleware('auth')

Route.resource('users', 'UsersController').only(['store'])
