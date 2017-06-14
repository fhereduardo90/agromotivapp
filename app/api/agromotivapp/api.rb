module Agromotivapp
  class API < Grape::API
    format :json

    mount Agromotivapp::V1::Root
  end
end
