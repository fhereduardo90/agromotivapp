module Categories
  class CategorySerializer < ActiveModel::Serializer
    attributes :id, :name, :description, :image, :created_at

    def created_at
      object.created_at.iso8601
    end

    def image
      if object.asset.present?
        object.asset.image.url
      end
    end
  end
end
