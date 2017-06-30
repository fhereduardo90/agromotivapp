class CreateProductsUnitsTable < ActiveRecord::Migration[5.1]
  def change
    create_table :products_units do |t|
      t.references :product, index: true, foreign_key: true
      t.references :unit, index: true, foreign_key: true
      t.monetize :price
    end

    add_index :products_units, [:product_id, :unit_id], unique: true
  end
end
