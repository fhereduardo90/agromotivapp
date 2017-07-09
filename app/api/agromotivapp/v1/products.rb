module Agromotivapp
  module V1
    class Products < Root
      namespace :products do
        namespace do
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
      end
    end
  end
end
