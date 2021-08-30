import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Messages extends BaseSchema {
  protected tableName = 'messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()

      table
        .integer('chat_id')
        .unsigned()
        .notNullable()
        .references('chats.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.uuid('user_id').references('users.id').onDelete('SET NULL').onUpdate('CASCADE')

      table.text('text')

      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
