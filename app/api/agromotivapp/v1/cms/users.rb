module Agromotivapp
  module V1
    module CMS
      class Users < Base
        namespace :cms do
          namespace :users do
            before do
              doorkeeper_authorize! :admin
            end

            desc 'Users List'
            params do
              use :pagination
              use :search
            end
            get each_serializer: ::Users::UserSerializer, include: '**' do
              if params[:q].present?
                paginate User.full_text_search(params[:q])
                           .page(params[:page])
                           .per(params[:per_page])
              else
                paginate User.page(params[:page]).per(params[:per_page])
              end
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
                  requires :password_confirmation, allow_blank: false, type: String,
                  documentation: { required: false, type: 'password' }
                end
              end
              put do
                status 204

                if request.env['CONTENT_TYPE'] == 'application/json'
                  params.except!(:image)
                end

                result = ::Cms::Users::UpdateUser.call(params)

                error!({ message: result.message, errors: result.errors }, result.code) unless result.succeed?
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

                error!({ message: result.message, errors: result.errors }, result.code) unless result.succeed?
              end
            end
          end
        end
      end
    end
  end
end
