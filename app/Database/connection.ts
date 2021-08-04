import Env from '@ioc:Adonis/Core/Env'
import { createConnection } from 'mongoose'

const Database = createConnection(Env.get('MONGO_URL'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
export default Database
