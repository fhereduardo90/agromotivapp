class AddNameToProductsUnits < ActiveRecord::Migration[5.1]
  def change
    add_column :products_units, :name, :string
  end
end
