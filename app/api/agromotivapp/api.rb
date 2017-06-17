module Agromotivapp
  class API < Grape::API
    format :json
    formatter :json, Grape::Formatter::ActiveModelSerializers

    mount Agromotivapp::V1::Root
  end
end
