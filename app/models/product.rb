class Product < ApplicationRecord
  include PgSearch

  pg_search_scope :full_text_search, against: [:name, :description], using: {
    tsearch: { prefix: true }
  }

  belongs_to :category
  belongs_to :seller
  has_many :assets, as: :attachable, dependent: :destroy
  has_many :active_assets, -> { where deleted: false }, as: :attachable, class_name: 'Asset'
  has_many :products_units, dependent: :destroy

  validates :name, presence: true
end
