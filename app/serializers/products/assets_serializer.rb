module Products
  class AssetsSerializer < ActiveModel::Serializer
    attributes :id, :url

    def url
      object.image.url
    end
  end
end
