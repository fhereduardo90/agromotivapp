class CreateUnits < ActiveRecord::Migration[5.1]
  def change
    create_table :units do |t|
      t.string :name, null: false
      t.text :description

      t.timestamps
    end

    add_index :units, :name, unique: true
  end
end
