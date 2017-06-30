module Agromotivapp
  module V1
    class Sellers < Root
      namespace :sellers do
        desc 'Create seller'
        params do
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

          result = ::Sellers::CreateSeller.call(params)

          if result.succeed?
            result.response
          else
            error!({ message: result.message, errors: result.errors }, result.code)
          end
        end

        namespace do
          before do
            doorkeeper_authorize! :seller
          end

          namespace :me do
            desc 'Seller Profile'
            get serializer: ::Sellers::SellerSerializer do
              current_resource_owner
            end

            desc 'Update seller\'s profile'
            params do
              optional :image, type: File
              optional :name, allow_blank: false, type: String
              optional :email, regexp: Devise::email_regexp, allow_blank: false, type: String
              optional :address, allow_blank: false, type: String
              optional :phone, allow_blank: false, type: String
              optional :password, allow_blank: false, type: String
              optional :state_id, allow_blank: false, type: Integer
              optional :city_id, allow_blank: false, type: Integer
              exactly_one_of :state_id, :city_id
              given :password do
                requires :password_confirmation, allow_blank: false, type: String
              end
            end
            put do
              if request.env['CONTENT_TYPE'] == 'application/json'
                params.except!(:image)
              end

              result = ::Sellers::UpdateSeller.call(current_resource_owner, params)

              if result.succeed?
                status 204
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            namespace :products do
              desc 'Seller\'s products'
              get each_serializer: ::Products::ProductSerializer do
                result = ::Products::ProductsBySeller.call(current_resource_owner)

                if result.succeed?
                  result.response
                else
                  error!({ message: result.message, errors: result.errors }, result.code)
                end
              end

              desc 'Seller\'s product detail'
              params do
                requires :id, allow_blank: false, type: Integer
              end
              get ':id', serializer: ::Products::ProductSerializer do
                result = ::Products::FindProductBySeller.call(current_resource_owner, params[:id])

                if result.succeed?
                  result.response
                else
                  error!({ message: result.message, errors: result.errors }, result.code)
                end
              end
            end
          end
        end
      end
    end
  end
end
