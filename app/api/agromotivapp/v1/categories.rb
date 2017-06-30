module Agromotivapp
  module V1
    class Categories < Root
      namespace :categories do
        before do
          doorkeeper_authorize! :seller
        end

        desc 'Categories List'
        get each_serializer: ::Categories::CategorySerializer do
          Category.all
        end

        params do
          requires :id, allow_blank: false, type: Integer
        end
        desc 'Category Detail'
        get ':id', serializer: ::Categories::CategorySerializer do
          result = ::Categories::FindCategory.call(params[:id])

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