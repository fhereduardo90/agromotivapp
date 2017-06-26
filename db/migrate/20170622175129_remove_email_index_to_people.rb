class RemoveEmailIndexToPeople < ActiveRecord::Migration[5.1]
  def change
    remove_index :people, :email
  end
end
