module Products
  class ProductSerializer < ActiveModel::Serializer
    attributes :id, :name, :description, :created_at

    belongs_to :category, serializer: ::Categories::CategorySerializer
    has_many :products_units, key: :units, serializer: ProductUnitsSerializer
    has_many :assets, key: :images, serializer: AssetsSerializer do
      object.active_assets
    end

    def created_at
      object.created_at.iso8601
    end
  end
end
