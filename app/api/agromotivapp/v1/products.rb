module Agromotivapp
  module V1
    class Products < Root
      namespace :products do
        namespace do
          before do
            doorkeeper_authorize! :seller, :user
          end

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

          desc 'Update Product'
          params do
            requires :id, allow_blank: false, type: Integer
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
            end
          end
        end

        namespace do
          before do
            doorkeeper_authorize! :seller
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
            end
          end
          post do
            result = ::Products::CreateProduct.call(current_resource_owner, params)

            if result.succeed?
              status 201
            else
              error!({ message: result.message, errors: result.errors }, result.code)
            end
          end

          desc 'Update Product'
          params do
            requires :id, allow_blank: false, type: Integer
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
            end
          end
          put ':id' do
            result = ::Products::UpdateProduct.call(current_resource_owner, params)

            if result.succeed?
              status 204
            else
              error!({ message: result.message, errors: result.errors }, result.code)
            end
          end
        end
      end
    end
  end
end
