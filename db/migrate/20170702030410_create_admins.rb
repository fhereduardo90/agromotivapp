class CreateAdmins < ActiveRecord::Migration[5.1]
  def change
    create_table :admins do |t|
      t.string :name, null: false
      t.string :email, null: false

      t.timestamps
    end

    add_index :admins, :email, unique: true
  end
end
