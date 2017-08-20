module Agromotivapp::V1::CMS
  class Root < Grape::API
    version 'v1', using: :path

    mount Agromotivapp::V1::CMS::Admins
    mount Agromotivapp::V1::CMS::Categories
    mount Agromotivapp::V1::CMS::Products
    mount Agromotivapp::V1::CMS::Sellers
    mount Agromotivapp::V1::CMS::Units
    mount Agromotivapp::V1::CMS::Users
  end
end
