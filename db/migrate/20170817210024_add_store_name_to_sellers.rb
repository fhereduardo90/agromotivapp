class AddStoreNameToSellers < ActiveRecord::Migration[5.1]
  def change
    add_column :people, :store_name, :string
  end
end
