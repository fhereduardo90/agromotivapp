class AddTimestamptToProductsUnits < ActiveRecord::Migration[5.1]
  def up
    add_timestamps :products_units, default: Time.now.utc
  end

  def down
    remove_timestamps :products_units
  end
end
