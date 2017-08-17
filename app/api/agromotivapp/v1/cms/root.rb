require 'doorkeeper/grape/helpers'

module Agromotivapp::V1::Cms
  class Root < Grape::API
    version 'v1', using: :path
    default_format :json

    helpers Doorkeeper::Grape::Helpers, Agromotivapp::CurrentResourceOwnerHelper

    mount Agromotivapp::V1::Cms::Admins
    mount Agromotivapp::V1::Cms::Categories
    mount Agromotivapp::V1::Cms::Products
    mount Agromotivapp::V1::Cms::Sellers
    mount Agromotivapp::V1::Cms::Units
    mount Agromotivapp::V1::Cms::Users
  end
end
