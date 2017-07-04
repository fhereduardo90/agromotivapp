module Cms
  module Admins
    class AdminSerializer < ActiveModel::Serializer
      attributes :id, :name, :email, :created_at

      def created_at
        object.created_at.iso8601
      end
    end
  end
end
