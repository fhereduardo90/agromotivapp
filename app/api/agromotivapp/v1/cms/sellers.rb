module Agromotivapp
  module V1
    module CMS
      class Sellers < Base
        namespace :cms do
          namespace :sellers do
            before do
              doorkeeper_authorize! :admin
            end

            desc 'Sellers List'
            params do
              use :pagination
            end
            get each_serializer: ::Sellers::SellerSerializer, include: '**' do
              paginate Seller.page(params[:page]).per(params[:per_page])
            end

            desc 'Create Seller'
            params do
              optional :image, type: File
              requires :name, allow_blank: false, type: String
              optional :store_name, allow_blank: false, type: String
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
            post serializer: ::Sellers::SellerSerializer do
              status 201

              if request.env['CONTENT_TYPE'] == 'application/json'
                params.except!(:image)
              end

              result = ::Cms::Sellers::CreateSeller.call(params)

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            route_param :id, allow_blank: false, type: Integer do
              desc 'Update seller'
              params do
                optional :image, type: File
                optional :name, allow_blank: false, type: String
                optional :store_name, allow_blank: false, type: String
                optional :email, regexp: Devise::email_regexp, allow_blank: false, type: String
                optional :address, allow_blank: false, type: String
                optional :phone, allow_blank: false, type: String
                optional :password, allow_blank: false, type: String
                optional :state_id, allow_blank: false, type: Integer
                optional :city_id, allow_blank: false, type: Integer
                mutually_exclusive :state_id, :city_id
                given :password do
                  requires :password_confirmation, allow_blank: false, type: String
                end
              end
              put do
                status 204

                if request.env['CONTENT_TYPE'] == 'application/json'
                  params.except!(:image)
                end

                result = ::Cms::Sellers::UpdateSeller.call(params)

                error!({ message: result.message, errors: result.errors }, result.code) unless result.succeed?
              end

              desc 'Seller Detail'
              get serializer: ::Sellers::SellerSerializer, include: '**' do
                result = ::Sellers::FindSeller.call(params[:id])

                if result.succeed?
                  result.response
                else
                  error!({ message: result.message, errors: result.errors }, result.code)
                end
              end

              desc 'Delete Seller'
              delete do
                status 204

                result = ::Cms::Sellers::DeleteSeller.call(params[:id])

                error!({ message: result.message, errors: result.errors }, result.code) unless result.succeed?
              end
            end
          end
        end
      end
    end
  end
end
