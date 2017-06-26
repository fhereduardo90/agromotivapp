require 'doorkeeper/grape/helpers'

module Agromotivapp
  module V1
    class Root < Grape::API
      helpers Doorkeeper::Grape::Helpers
      version 'v1', using: :path
      content_type :json, 'application/json'

      default_format :json

      mount Agromotivapp::V1::Users
      mount Agromotivapp::V1::Sellers
      mount Agromotivapp::V1::States

      helpers do
        def current_resource_owner
          return unless doorkeeper_token

          case doorkeeper_token.scopes.first
          when 'user'
            Person.find(doorkeeper_token.resource_owner_id)
          when 'seller'
            Seller.find(doorkeeper_token.resource_owner_id)
          end
        end
      end
    end
  end
end
