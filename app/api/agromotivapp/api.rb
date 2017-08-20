require 'doorkeeper/grape/helpers'
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

  module SharedParams
    extend Grape::API::Helpers

    params :pagination do
      optional :page, type: Integer, allow_blank: false
      optional :per_page, type: Integer, allow_blank: false
    end

    params :search do
      optional :q, type: String, allow_blank: false
    end
  end

  class API < Grape::API
    format :json
    formatter :json, Grape::Formatter::ActiveModelSerializers

    mount Agromotivapp::V1::Root
    mount Agromotivapp::V1::CMS::Root

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
