class CreateAssets < ActiveRecord::Migration[5.1]
  def change
    create_table :assets do |t|
      t.attachment :image
      t.references :attachable, polymorphic: true, index: true
      t.timestamps
    end
  end
end
