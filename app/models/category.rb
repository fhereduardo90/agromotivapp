class Category < ApplicationRecord
  has_many :assets, as: :attachable, dependent: :destroy
  has_many :products, dependent: :nullify
  has_one :asset, -> { where deleted: false }, as: :attachable, dependent: :destroy
  belongs_to :admin

  validates :admin, presence: true
  validates :name, presence: true, uniqueness: true
end
