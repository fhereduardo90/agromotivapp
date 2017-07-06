class State < ApplicationRecord
  has_many :cities
  has_many :users
  has_many :products

  validates :name, presence: true
end
