class Unit < ApplicationRecord
  has_many :products_units
  validates :name, presence: true, uniqueness: true
end
