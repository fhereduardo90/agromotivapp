module Agromotivapp
  module V1
    module Cms
      class Admins < ::Agromotivapp::V1::Root
        namespace :cms do
          namespace :admins do
            before do
              doorkeeper_authorize! :admin
            end

            desc 'Create Admin'
            params do
              requires :name, allow_blank: false, type: String
              requires :email, allow_blank: false, regexp: Devise::email_regexp, type: String
              requires :password, allow_blank: false, type: String
              given :password do
                requires :password_confirmation, allow_blank: false, type: String
              end
            end
            post serializer: ::Cms::Admins::AdminSerializer do
              status 201

              result = ::Cms::Admins::CreateAdmin.call(params)

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            desc 'Admin List'
            get each_serializer: ::Cms::Admins::AdminSerializer do
              Admin.all
            end

            params do
              requires :id, type: Integer, allow_blank: false
            end
            get ':id', requirements: { id: /[0-9]*/ }, serializer: ::Cms::Admins::AdminSerializer do
              result = ::Cms::Admins::FindAdmin.call(params[:id])

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            namespace :me do
              desc 'Admin Profile'
              get serializer: ::Cms::Admins::AdminSerializer do
                current_resource_owner
              end

              desc 'Update Admin Profile'
              params do
                optional :name, allow_blank: false, type: String
                optional :email, allow_blank: false, regexp: Devise::email_regexp, type: String
                optional :password, allow_blank: false, type: String
                given :password do
                  requires :password_confirmation, allow_blank: false, type: String
                end
              end
              put do
                status 204

                result = ::Cms::Admins::UpdateAdmin.call(current_resource_owner, params)
                error!({ message: result.message, errors: result.errors }, result.code) unless result.succeed?
              end
            end
          end
        end
      end
    end
  end
end