module Agromotivapp
  module V1
    class Products < Base
      namespace :products do
        desc 'Product List'
        params do
          use :pagination
          use :search
        end
        get each_serializer: ::Products::ProductSerializer do
          if params[:q].present?
            paginate Product.full_text_search(params[:q])
                       .page(params[:page])
                       .per(params[:per_page])
          else
            paginate Product.page(params[:page]).per(params[:per_page])
          end
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
