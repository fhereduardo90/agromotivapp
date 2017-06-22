require 'doorkeeper/grape/helpers'

module Agromotivapp
  module V1
    class Root < Grape::API
      helpers Doorkeeper::Grape::Helpers
      version 'v1', using: :path
      content_type :json, 'application/json'

      default_format :json

      mount Agromotivapp::V1::Users

      helpers do
        def current_resource_owner
          User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
        end
      end
    end
  end
end
