module Agromotivapp
  module V1
    module Cms
      class Users < ::Agromotivapp::V1::Root
        namespace :cms do
          namespace :users do
            before do
              doorkeeper_authorize! :admin
            end

            desc 'Users List'
            get each_serializer: ::Users::UserSerializer, include: '**' do
              User.all
            end

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
            post serializer: ::Users::UserSerializer do
              status 201

              if request.env['CONTENT_TYPE'] == 'application/json'
                params.except!(:image)
              end

              result = ::Cms::Users::CreateUser.call(params)

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            route_param :id, allow_blank: false, type: Integer do
              desc 'Update user'
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

                result = ::Cms::Users::UpdateUser.call(params)

                error!({ message: result.message, errors: result.errors },
                       result.code) unless result.succeed?
              end

              desc 'User Detail'
              get serializer: ::Users::UserSerializer, include: '**' do
                result = ::Users::FindUser.call(params[:id])

                if result.succeed?
                  result.response
                else
                  error!({ message: result.message, errors: result.errors }, result.code)
                end
              end

              desc 'Delete User'
              delete do
                status 204

                result = ::Cms::Users::DeleteUser.call(params[:id])

                error!({ message: result.message, errors: result.errors },
                       result.code) unless result.succeed?
              end
            end
          end
        end
      end
    end
  end
end
