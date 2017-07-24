module Cms
  module Units
    class UnitAdminSerializer < ::Units::UnitSerializer
      belongs_to :admin, serializer: ::Cms::Admins::AdminSerializer
    end
  end
end
