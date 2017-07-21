class ProductsUnit < ApplicationRecord
  belongs_to :product
  belongs_to :unit

  validates :product, :unit, :name, presence: true
  validates :unit, uniqueness:  { scope: :product }
  validates :quantity, numericality: { only_integer: true, greater_than: 0 }

  monetize :price_cents, allow_nil: false
end
