import Event from '@ioc:Adonis/Core/Event'

Event.on('new:message', (data) => {
  console.log(data)
})
