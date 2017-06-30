module Products
  class ProductSerializer < ActiveModel::Serializer
    attributes :id, :name, :description, :images, :created_at

    belongs_to :category, serializer: ::Categories::CategorySerializer
    has_many :products_units, key: :units, serializer: ProductUnitsSerializer

    def created_at
      object.created_at.iso8601
    end

    def images
      if object.active_assets.present?
        object.active_assets.map { |asset| asset.image.url }
      else
        []
      end
    end
  end
end
