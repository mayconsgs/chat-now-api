import { BaseModel, column, HasMany, hasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Message from './Message'
import User from './User'
export default class Chat extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: 'isGroup' })
  public isGroup: boolean

  @column()
  public title: string | null
  @column()
  public description: string | null
  @column({ serializeAs: 'shareCode' })
  public shareCode: string | null

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'chat_user',
  })
  public users: ManyToMany<typeof User>

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>
}
