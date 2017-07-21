module Products
  class ProductUnitsSerializer < ActiveModel::Serializer
    attributes :quantity, :price, :unit, :name

    def price
      object.price.format
    end

    def unit
      ActiveModelSerializers::SerializableResource.new(
        object.unit,
        serializer: ::Units::UnitSerializer
      )
    end
  end
end
