module Agromotivapp
  module V1
    module Cms
      class Categories < ::Agromotivapp::V1::Root
        namespace :cms do
          namespace :categories do
            before do
              doorkeeper_authorize! :admin
            end

            desc 'Categories List'
            params do
              optional :page, type: Integer, allow_blank: false
              optional :per_page, type: Integer, allow_blank: false
            end
            get each_serializer: ::Cms::Categories::CategorySerializer do
              paginate Category.page(params[:page]).per(params[:per_page])
            end

            desc 'Create Category'
            params do
              requires :name, type: String, allow_blank: false
              optional :image, type: File, allow_blank: false
              optional :description, type: String, allow_blank: false
            end
            post serializer: ::Cms::Categories::CategorySerializer do
              status 201

              if request.env['CONTENT_TYPE'] == 'application/json'
                params.except!(:image)
              end

              result = ::Cms::Categories::CreateCategory.call(current_resource_owner, params)

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            route_param :id, allow_blank: false, type: Integer do
              desc 'Category Detail'
              get serializer: ::Cms::Categories::CategorySerializer do
                result = ::Categories::FindCategory.call(params[:id])

                if result.succeed?
                  result.response
                else
                  error!({ message: result.message, errors: result.errors }, result.code)
                end
              end

              desc 'Update Category'
              params do
                optional :name, type: String, allow_blank: false
                optional :image, type: File, allow_blank: false
                optional :description, type: String, allow_blank: false
              end
              put do
                status 204

                if request.env['CONTENT_TYPE'] == 'application/json'
                  params.except!(:image)
                end

                result = ::Cms::Categories::UpdateCategory.call(current_resource_owner, params)

                error!({ message: result.message, errors: result.errors },
                       result.code) unless result.succeed?
              end

              desc 'Delete Category'
              delete do
                status 204

                result = ::Cms::Categories::DeleteCategory.call(params[:id])

                error!({ message: result.message, errors: result.errors },
                       result.code) unless result.succeed?
              end

              namespace :products do
                desc 'Category Products'
                params do
                  optional :page, type: Integer, allow_blank: false
                  optional :per_page, type: Integer, allow_blank: false
                end
                get each_serializer: ::Products::ProductSerializer do
                  result = ::Categories::FindCategoryProducts.call(params[:id])

                  if result.succeed?
                    paginate result.response.page(params[:page]).per(params[:per_page])
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
