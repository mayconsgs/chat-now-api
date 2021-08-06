import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuid()
  }

  @column()
  public firstName: string
  @column()
  public lastName: string | null
  @column()
  public bio: string | null

  @column()
  public email: string
  @column({ serializeAs: null })
  public passwordHash: string

  @column()
  public shareCode: string
  @column()
  public avatarUrl: string | null

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime
}
