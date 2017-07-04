module Cms
  module Units
    class UnitSerializer < ::Units::UnitSerializer
      belongs_to :admin, serializer: ::Cms::Admins::AdminSerializer
    end
  end
end
