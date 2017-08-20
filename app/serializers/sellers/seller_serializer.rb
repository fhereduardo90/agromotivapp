module Sellers
  class SellerSerializer < ::Users::UserSerializer
    attributes :store_name
  end
end
