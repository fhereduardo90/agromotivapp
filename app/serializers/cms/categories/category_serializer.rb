module Cms
  module Categories
    class CategorySerializer < ::Categories::CategorySerializer
      belongs_to :admin, serializer: ::Cms::Admins::AdminSerializer
    end
  end
end
