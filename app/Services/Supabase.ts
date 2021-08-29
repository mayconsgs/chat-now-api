import Env from '@ioc:Adonis/Core/Env'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(Env.get('SUPABASE_URL'), Env.get('SUPABASE_KEY'))

export default supabase
