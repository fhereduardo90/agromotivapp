class Category < ApplicationRecord
  has_many :assets, as: :attachable, dependent: :destroy
  has_one :asset, -> { where deleted: false }, as: :attachable, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
