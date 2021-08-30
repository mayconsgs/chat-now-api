import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChatUsers extends BaseSchema {
  protected tableName = 'chat_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('chat_id')
        .unsigned()
        .notNullable()
        .references('chats.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .uuid('user_id')
        .notNullable()
        .references('users.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.unique(['chat_id', 'user_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
