module Agromotivapp
  module V1
    class Sellers < Base
      namespace :sellers do
        desc 'Seller List'
        get serializer: ::Sellers::SellerSerializer do
          Seller.all
        end

        desc 'Create seller'
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
        post serializer: ::Tokens::AccessTokenSerializer do
          status 201

          result = ::Sellers::CreateSeller.call(params)

          if result.succeed?
            result.response
          else
            error!({ message: result.message, errors: result.errors }, result.code)
          end
        end

        route_param :id, allow_blank: false, type: Integer, requirements: { id: /[0-9]*/ } do
          desc 'Seller Detail'
          get serializer: ::Sellers::SellerSerializer do
            result = ::Sellers::FindSeller.call(params[:id])

            if result.succeed?
              result.response
            else
              error!({ message: result.message, errors: result.errors }, result.code)
            end
          end

          namespace :products do
            desc 'Seller Products'
            params do
              use :pagination
              use :search
            end
            get serializer: ::Products::ProductSerializer do
              result = ::Sellers::Products.call(params[:id])

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end
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

            desc 'Update seller profile'
            params do
              optional :image, type: File
              optional :name, allow_blank: false, type: String
              optional :store_name, allow_blank: false, type: String
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

              result = ::Sellers::UpdateSeller.call(current_resource_owner, params)

              error!({ message: result.message, errors: result.errors }, result.code) unless result.succeed?
            end

            namespace :products do
              desc 'Seller products'
              params do
                use :pagination
                use :search
              end
              get each_serializer: ::Products::ProductSerializer do
                result = ::Products::ProductsBySeller.call(current_resource_owner)

                if result.succeed?
                  if params[:q].present?
                    paginate result.response
                               .full_text_search(params[:q])
                               .page(params[:page])
                               .per(params[:per_page])
                  else
                    paginate result.response.page(params[:page]).per(params[:per_page])
                  end
                else
                  error!({ message: result.message, errors: result.errors }, result.code)
                end
              end

              desc 'Create Product'
              params do
                requires :name, allow_blank: false, type: String
                requires :category_id, allow_blank: false, type: Integer
                optional :description, allow_blank: false, type: String
                optional :images, type: Array[File], allow_blank: false
                optional :units, type: Array do
                  requires :unit_id, type: Integer, allow_blank: false
                  requires :price, type: BigDecimal, allow_blank: false
                  requires :quantity, allow_blank: false, type: Integer
                  requires :name, allow_blank: false, type: String
                end
              end
              post serializer: ::Products::ProductSerializer do
                status 201

                result = ::Products::CreateProduct.call(current_resource_owner, params)

                if result.succeed?
                  result.response
                else
                  error!({ message: result.message, errors: result.errors }, result.code)
                end
              end

              route_param :id, allow_blank: false, type: Integer do
                desc 'Update Product'
                params do
                  requires :name, allow_blank: false, type: String
                  requires :category_id, allow_blank: false, type: Integer
                  optional :description, allow_blank: false, type: String
                  optional :images, type: Array[File], allow_blank: false
                  optional :units, type: Array do
                    requires :unit_id, type: Integer, allow_blank: false
                    requires :price, type: BigDecimal, allow_blank: false
                    requires :quantity, allow_blank: false, type: Integer
                    requires :name, allow_blank: false, type: String
                  end
                end
                put do
                  status 204

                  result = ::Products::UpdateProduct.call(current_resource_owner, params)

                  error!({ message: result.message, errors: result.errors }, result.code) unless result.succeed?
                end

                desc 'Seller product detail'
                get serializer: ::Products::ProductSerializer do
                  result = ::Products::FindProductBySeller.call(current_resource_owner, params[:id])

                  if result.succeed?
                    result.response
                  else
                    error!({ message: result.message, errors: result.errors }, result.code)
                  end
                end

                desc 'Delete Product'
                delete do
                  status 204

                  result = ::Products::DeleteProduct.call(current_resource_owner, params[:id])

                  error!({ message: result.message, errors: result.errors }, result.code) unless result.succeed?
                end
              end

              route_param :product_id, allow_blank: false, type: Integer do
                namespace :images do
                  desc 'Add new Product Image'
                  params do
                    requires :image, type: File, allow_blank: false
                  end
                  post serializer: ::Products::ProductSerializer do
                    status 201

                    result = ::Products::AddNewImage.call(
                      current_resource_owner,
                      params[:product_id],
                      params[:image]
                    )

                    if result.succeed?
                      result.response
                    else
                      error!({ message: result.message, errors: result.errors }, result.code)
                    end
                  end

                  desc 'Delete Product Image'
                  params do
                    requires :id, type: Integer, allow_blank: false
                  end
                  delete ':id' do
                    status 204

                    result = ::Products::DeleteImage.call(
                      current_resource_owner,
                      params[:product_id],
                      params[:id]
                    )

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
  end
end
