require 'doorkeeper/grape/helpers'

module Agromotivapp
  module V1
    class Base < Grape::API
      content_type :json, 'application/json'
      format :json
      default_format :json

      helpers Doorkeeper::Grape::Helpers,
              Agromotivapp::CurrentResourceOwnerHelper,
              Agromotivapp::SharedParams
    end
  end
end
