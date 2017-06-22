module Agromotivapp
  module V1
    class Users < Root
      namespace :users do
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
        post serializer: ::Tokens::AccessTokenSerializer do
          status 201

          result = ::Users::CreateUser.call(params)

          if result.succeed?
            result.response
          else
            error!(result.errors, 422)
          end
        end

        namespace do
          before do
            doorkeeper_authorize!
          end

          desc 'Return user list'
          get each_serializer: ::Users::UserSerializer do
            User.all
          end

          namespace :me do
            desc 'User\'s profile'
            get serializer: ::Users::UserSerializer do
              current_resource_owner
            end

            desc 'Update User\'s Information'
            params do
              optional :image, type: File
              optional :name, allow_blank: false, type: String
              optional :email, regexp: /.+@.+/, allow_blank: false, type: String
              optional :address, allow_blank: false, type: String
              optional :phone, allow_blank: false, type: String
              optional :password, allow_blank: false, type: String
              given :password do
                requires :password_confirmation, allow_blank: false, type: String
              end
            end
            put do
              if request.env['CONTENT_TYPE'] == 'application/json'
                params.except!(:image)
              end

              result = ::Users::UpdateUser.call(current_resource_owner, params)

              if result.succeed?
                status 204
              else
                error!({ message: result.message, errors: result.errors }, 422)
              end
            end

            desc 'Update User\'s Password'
            params do
              requires :password, allow_blank: false, type: String
              requires :password_confirmation, allow_blank: false, type: String
            end
            put 'password' do
              result = ::Users::UpdatePassword.call(current_resource_owner, params)
              if result.succeed?
                status 204
              else
                error!(result.errors, 422)
              end
            end
          end
        end
      end
    end
  end
end
