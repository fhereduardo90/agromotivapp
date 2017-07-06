require 'doorkeeper/grape/helpers'
require 'grape-swagger'
require 'grape-active_model_serializers'

module Agromotivapp
  module V1
    class Oauth < Grape::API
      format :json
      formatter :json, Grape::Formatter::ActiveModelSerializers
      content_type :json, 'application/json'
      default_format :json

      resources :oauth do
        desc 'Requires for an access token'
        params do
          requires :grant_type,
                   type: String,
                   allow_blank: false,
                   values: %w(password)
          requires :email,
                   type: String,
                   regexp: Devise::email_regexp,
                   allow_blank: false
          requires :password,
                   type: String,
                   allow_blank: false
          requires :scope,
                   type: String,
                   allow_blank: false,
                   values: %w(seller user admin)
        end
        post :token do
        end
      end
    end

    class Root < Grape::API
      helpers Doorkeeper::Grape::Helpers
      version 'v1', using: :path
      default_format :json

      before do
        header['Access-Control-Allow-Origin'] = '*'
        header['Access-Control-Request-Method'] = '*'
      end

      mount Agromotivapp::V1::Users
      mount Agromotivapp::V1::Sellers
      mount Agromotivapp::V1::States
      mount Agromotivapp::V1::Products
      mount Agromotivapp::V1::Units
      mount Agromotivapp::V1::Categories
      mount Agromotivapp::V1::Oauth

      mount Agromotivapp::V1::Cms::Admins
      mount Agromotivapp::V1::Cms::Categories
      mount Agromotivapp::V1::Cms::Units
      mount Agromotivapp::V1::Cms::Sellers
      mount Agromotivapp::V1::Cms::Users

      add_swagger_documentation mount_path: '/swagger_doc',
                                in: 'json',
                                security_definitions: {
                                  api_key: {
                                    type: 'apiKey',
                                    name: 'Authorization',
                                    in: 'header'
                                  }
                                }

      helpers do
        def current_resource_owner
          return unless doorkeeper_token

          case doorkeeper_token.scopes.first
          when 'user'
            Person.find(doorkeeper_token.resource_owner_id)
          when 'seller'
            Seller.find(doorkeeper_token.resource_owner_id)
          when 'admin'
            Admin.find(doorkeeper_token.resource_owner_id)
          end
        end
      end
    end
  end
end
