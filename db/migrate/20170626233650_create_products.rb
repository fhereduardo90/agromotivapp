class CreateProducts < ActiveRecord::Migration[5.1]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.text :description
      t.references :category, foreign_key: true
      t.references :seller, index: true, foreign_key: { to_table: :people }

      t.timestamps
    end

    add_index :products, :name
  end
end
