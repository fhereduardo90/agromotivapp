require 'doorkeeper/grape/helpers'

module Agromotivapp
  module V1
    class Root < Grape::API
      version 'v1', using: :path

      helpers Doorkeeper::Grape::Helpers,
              Agromotivapp::CurrentResourceOwnerHelper,
              Agromotivapp::SharedParams

      mount Agromotivapp::V1::Users
      mount Agromotivapp::V1::Sellers
      mount Agromotivapp::V1::States
      mount Agromotivapp::V1::Products
      mount Agromotivapp::V1::Units
      mount Agromotivapp::V1::Categories
      mount Agromotivapp::V1::Oauth
      mount Agromotivapp::V1::Passwords
    end
  end
end
