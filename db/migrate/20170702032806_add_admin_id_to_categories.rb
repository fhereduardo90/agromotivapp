class AddAdminIdToCategories < ActiveRecord::Migration[5.1]
  def change
    add_reference :categories, :admin, foreign_key: true
  end
end
