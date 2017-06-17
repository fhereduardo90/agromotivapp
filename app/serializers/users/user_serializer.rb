module Users
  class UserSerializer < ActiveModel::Serializer
    attributes :name, :email, :address, :phone, :created_at

    def created_at
      object.created_at.iso8601
    end
  end
end
