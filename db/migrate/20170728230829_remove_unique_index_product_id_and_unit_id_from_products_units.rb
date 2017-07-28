class RemoveUniqueIndexProductIdAndUnitIdFromProductsUnits < ActiveRecord::Migration[5.1]
  def up
    remove_index :products_units, [:product_id, :unit_id]
  end

  def down
    add_index :products_units, [:product_id, :unit_id], unique: true
  end
end
