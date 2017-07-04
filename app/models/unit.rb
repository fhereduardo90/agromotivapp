class Unit < ApplicationRecord
  has_many :products_units
  belongs_to :admin

  validates :admin, presence: true
  validates :name, presence: true, uniqueness: true
end
