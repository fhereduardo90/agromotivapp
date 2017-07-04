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
            get each_serializer: ::Cms::Categories::CategorySerializer do
              Category.all
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

            namespace ':id' do
              desc 'Category Detail'
              params do
                requires :id, allow_blank: false, type: Integer
              end
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
                requires :id, allow_blank: false, type: Integer
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
