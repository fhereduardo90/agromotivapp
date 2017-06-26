class State < ApplicationRecord
  has_many :cities
  has_many :users
  has_many :sellers

  validates :name, presence: true
end
