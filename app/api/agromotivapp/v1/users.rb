module Agromotivapp
  module V1
    class Users < Base
      namespace :users do
        desc 'Create user'
        params do
          optional :image, type: File, allow_blank: false
          requires :name, allow_blank: false, type: String
          requires :email, allow_blank: false, regexp: Devise::email_regexp, type: String
          requires :address, allow_blank: false, type: String
          optional :phone, allow_blank: false, type: String
          optional :state_id, allow_blank: false, type: Integer
          optional :city_id, allow_blank: false, type: Integer
          exactly_one_of :state_id, :city_id
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
            error!({ message: result.message, errors: result.errors }, result.code)
          end
        end

        namespace do
          before do
            doorkeeper_authorize! :user
          end

          namespace :me do
            desc 'User profile'
            get serializer: ::Users::UserSerializer, include: '**' do
              current_resource_owner
            end

            desc 'Update User Information'
            params do
              optional :image, type: File, allow_blank: false
              optional :name, allow_blank: false, type: String
              optional :email, allow_blank: false, regexp: Devise::email_regexp, type: String
              optional :address, allow_blank: false, type: String
              optional :phone, allow_blank: false, type: String
              optional :state_id, allow_blank: false, type: Integer
              optional :city_id, allow_blank: false, type: Integer
              mutually_exclusive :state_id, :city_id
              optional :password, allow_blank: false, type: String
              given :password do
                requires :password_confirmation, allow_blank: false, type: String
              end
            end
            put do
              status 204

              if request.env['CONTENT_TYPE'] == 'application/json'
                params.except!(:image)
              end

              result = ::Users::UpdateUser.call(current_resource_owner, params)

              error!({ message: result.message, errors: result.errors }, result.code) unless result.succeed?
            end

            desc 'Update User Password'
            params do
              requires :password, allow_blank: false, type: String
              requires :password_confirmation, allow_blank: false, type: String
            end
            put 'password' do
              status 204

              result = ::Users::UpdatePassword.call(current_resource_owner, params)

              error!({ message: result.message, errors: result.errors }, result.code) unless result.succeed?
            end
          end
        end
      end
    end
  end
end
