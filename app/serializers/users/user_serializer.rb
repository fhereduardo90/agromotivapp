module Users
  class UserSerializer < ActiveModel::Serializer
    attributes :name, :email, :address, :phone, :avatar, :created_at

    belongs_to :city, serializer: ::States::CitySerializer
    belongs_to :state, serializer: ::States::StateSerializer

    def created_at
      object.created_at.iso8601
    end

    def avatar
      if object.asset.present?
        object.asset.image.url
      end
    end
  end
end
