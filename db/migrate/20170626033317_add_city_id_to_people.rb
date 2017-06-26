class AddCityIdToPeople < ActiveRecord::Migration[5.1]
  def change
    add_reference :people, :city, foreign_key: true
  end
end
