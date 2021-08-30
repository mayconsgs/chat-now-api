import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.string('first_name').notNullable()
      table.string('last_name')
      table.text('bio')

      table.string('email').notNullable().unique()
      table.string('password_hash').notNullable()

      table.string('share_code').notNullable()
      table.string('avatar_url')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
