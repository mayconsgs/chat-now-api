import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Chat from './Chat'
import User from './User'
import View from './View'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @column({ serializeAs: null })
  public userId: string | null
  @column({ serializeAs: null })
  public chatId: number

  @column.dateTime({ autoCreate: true, serializeAs: 'sendedAt' })
  public createdAt: DateTime

  @belongsTo(() => Chat)
  public chat: BelongsTo<typeof Chat>
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
  @hasMany(() => View)
  public views: HasMany<typeof View>
}
