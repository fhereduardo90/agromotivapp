class AddDeletedToAssets < ActiveRecord::Migration[5.1]
  def up
    add_column :assets, :deleted, :boolean, default: false
    add_index :assets, :deleted
  end

  def down
    remove_index :assets, :deleted
    remove_column :assets, :deleted
  end
end
