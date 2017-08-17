require 'doorkeeper/grape/helpers'

module Agromotivapp
  module V1
    class Oauth < Grape::API
      content_type :json, 'application/json'
      format :json
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
      version 'v1', using: :path
      format :json
      default_format :json

      helpers Doorkeeper::Grape::Helpers, Agromotivapp::CurrentResourceOwnerHelper

      mount Agromotivapp::V1::Users
      mount Agromotivapp::V1::Sellers
      mount Agromotivapp::V1::States
      mount Agromotivapp::V1::Products
      mount Agromotivapp::V1::Units
      mount Agromotivapp::V1::Categories
      mount Agromotivapp::V1::Oauth
    end
  end
end
