require 'grape-swagger'

module Agromotivapp
  module CurrentResourceOwnerHelper
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

  class API < Grape::API
    format :json
    formatter :json, Grape::Formatter::ActiveModelSerializers

    mount Agromotivapp::V1::Root
    mount Agromotivapp::V1::Cms::Root

    add_swagger_documentation mount_path: '/swagger_doc',
                             in: 'json',
                             security_definitions: {
                               api_key: {
                                 type: 'apiKey',
                                 name: 'Authorization',
                                 in: 'header'
                               }
                             }
  end
end
