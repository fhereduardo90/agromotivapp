class AddStateIdToPeople < ActiveRecord::Migration[5.1]
  def change
    add_reference :people, :state, foreign_key: true
  end
end
