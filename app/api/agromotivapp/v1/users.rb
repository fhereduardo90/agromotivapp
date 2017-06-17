module Agromotivapp
  module V1
    class Users < Grape::API
      resource :users do
        desc 'Return user list'
        get each_serializer: ::Users::UserSerializer do
          User.all
        end

        desc 'Create user'
        params do
          requires :name, allow_blank: false, type: String
          requires :email, allow_blank: false, type: String
          requires :address, allow_blank: false, type: String
          optional :phone, allow_blank: false, type: String
          requires :password, allow_blank: false, type: String
          given :password do
            requires :password_confirmation, allow_blank: false, type: String
          end
        end
        post serializer: ::Users::UserSerializer do
          status 201

          result = ::Users::CreateUser.call(params)

          if result.succeed?
            result.response
          else
            error!(result.errors, 422)
          end
        end
      end
    end
  end
end
