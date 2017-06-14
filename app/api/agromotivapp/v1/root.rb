module Agromotivapp
  module V1
    class Root < Grape::API
      version 'v1', using: :path

      mount Agromotivapp::V1::Users
    end
  end
end