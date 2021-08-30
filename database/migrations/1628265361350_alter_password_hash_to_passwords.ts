import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('password_hash', 'password')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('password', 'password_hash')
    })
  }
}
