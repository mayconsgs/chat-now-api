import Encryption from '@ioc:Adonis/Core/Encryption'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  column,
  computed,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import Chat from './Chat'

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'firstName' })
  public firstName: string
  @column({ serializeAs: 'lastName' })
  public lastName: string | null
  @computed()
  public get fullName() {
    return this.firstName + (this.lastName ? ' ' + this.lastName : '')
  }

  @column()
  public bio: string | null

  @column()
  public email: string
  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @column({ serializeAs: 'shareCode' })
  public shareCode: string
  @column({ serializeAs: 'avatarUrl' })
  public avatarUrl: string | null

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @manyToMany(() => Chat)
  public chats: ManyToMany<typeof Chat>

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuid()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }

    user.shareCode = Encryption.encrypt(user.id)
  }
}
