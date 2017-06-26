module States
  class StateSerializer < ActiveModel::Serializer
    attributes :id, :name, :created_at

    def created_at
      object.created_at.iso8601
    end
  end
end
