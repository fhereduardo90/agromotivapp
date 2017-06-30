class AddQuantityToProductsUnits < ActiveRecord::Migration[5.1]
  def change
    add_column :products_units, :quantity, :integer, default: 0
  end
end
