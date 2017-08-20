module Agromotivapp
  module V1
    class Categories < Base
      namespace :categories do
        before do
          doorkeeper_authorize! :seller
        end

        desc 'Categories List'
        params do
          use :pagination
        end
        get each_serializer: ::Categories::CategorySerializer do
          paginate Category.page(params[:page]).per(params[:per_page])
        end

        route_param :id, allow_blank: false, type: Integer do
          desc 'Category Detail'
          get serializer: ::Categories::CategorySerializer do
            result = ::Categories::FindCategory.call(params[:id])

            if result.succeed?
              result.response
            else
              error!({ message: result.message, errors: result.errors }, result.code)
            end
          end

          namespace :products do
            desc 'Category Products'
            params do
              use :pagination
              use :search
            end
            get each_serializer: ::Products::ProductSerializer do
              result = ::Categories::FindCategoryProducts.call(params[:id])

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
          end
        end
      end
    end
  end
end