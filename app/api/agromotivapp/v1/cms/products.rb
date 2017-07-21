module Agromotivapp::V1::Cms
  class Products < ::Agromotivapp::V1::Root
    namespace :cms do
      before do
        doorkeeper_authorize! :admin
      end

      namespace :products do
        desc 'Product List'
        get each_serializer: ::Products::ProductSerializer do
          Product.all
        end

        desc 'Product Detail'
        params do
          requires :id, allow_blank: false, type: Integer
        end
        get ':id', serializer: ::Products::ProductSerializer do
          result = ::Products::FindProduct.call(params[:id])

          if result.succeed?
            result.response
          else
            error!({ message: result.message, errors: result.errors }, result.code)
          end
        end
      end

      namespace :sellers do
        route_param :seller_id, allow_blank: false, type: Integer do
          namespace :products do
            desc 'Seller Products'
            get each_serializer: ::Products::ProductSerializer do
              result = ::Cms::Products::ProductsBySeller.call(params[:seller_id])

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            desc 'Seller Product Detail'
            params do
              requires :product_id, allow_blank: false, type: Integer
            end
            get ':product_id', serializer: ::Products::ProductSerializer do
              result = ::Cms::Products::FindProductBySeller.call(params[:seller_id], params[:product_id])

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            desc 'Create Product'
            params do
              requires :name, allow_blank: false, type: String
              requires :category_id, allow_blank: false, type: Integer
              optional :description, allow_blank: false, type: String
              optional :images, type: Array do
                requires :file, type: File, allow_blank: false
              end
              requires :units, type: Array do
                requires :unit_id, type: Integer, allow_blank: false
                requires :price, type: BigDecimal, allow_blank: false
                requires :quantity, allow_blank: false, type: Integer
                requires :name, allow_blank: false, type: String
              end
            end
            post serializer: ::Products::ProductSerializer do
              status 201
              result = ::Cms::Products::CreateProduct.call(params)

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            desc 'Update Product'
            params do
              requires :product_id, allow_blank: false, type: Integer
              optional :name, allow_blank: false, type: String
              optional :category_id, allow_blank: false, type: Integer
              optional :description, allow_blank: false, type: String
              optional :images, type: Array do
                requires :file, type: File, allow_blank: false
              end
              optional :units, type: Array do
                requires :unit_id, type: Integer, allow_blank: false
                requires :price, type: BigDecimal, allow_blank: false
                requires :quantity, allow_blank: false, type: Integer
                requires :name, allow_blank: false, type: String
              end
            end
            put ':product_id' do
              status 204

              result = ::Cms::Products::UpdateProduct.call(params)

              error!({ message: result.message, errors: result.errors },
                     result.code) unless result.succeed?
            end
          end
        end
      end
    end
  end
end
