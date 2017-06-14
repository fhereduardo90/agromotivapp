module Agromotivapp
  module V1
    class Users < Grape::API
      resource :users do
        desc 'Return user list'
        get do
          []
        end
      end
    end
  end
end
