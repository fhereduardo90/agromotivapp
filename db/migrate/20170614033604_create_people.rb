class CreatePeople < ActiveRecord::Migration[5.1]
  def change
    create_table :people do |t|
      t.string :name
      t.string :email
      t.string :address
      t.string :phone

      t.timestamps
    end

    add_index :people, :email, unique: true
  end
end
