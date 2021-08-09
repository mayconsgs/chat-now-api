import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Message from './Message'
import User from './User'

export default class View extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: null })
  public messageId: number
  @column({ serializeAs: null })
  public userId: string

  @column.dateTime({ autoCreate: true, serializeAs: 'visualizedAt' })
  public createdAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
  @belongsTo(() => Message)
  public message: BelongsTo<typeof Message>
}
