module Agromotivapp
  module V1
    module CMS
      class Products < Base
        namespace :cms do
          before do
            doorkeeper_authorize! :admin
          end

          namespace :products do
            desc 'Product List'
            params do
              use :pagination
              use :search
            end
            get each_serializer: ::Products::ProductSerializer do
              if params[:q].present?
                paginate Product
                           .includes(:active_assets, :category, :seller, products_units: [:unit])
                           .full_text_search(params[:q])
                           .page(params[:page]).per(params[:per_page])
              else
                paginate Product
                           .includes(:active_assets, :category, :seller, products_units: [:unit])
                           .page(params[:page]).per(params[:per_page])
              end
            end

            route_param :id, allow_blank: false, type: Integer do
              desc 'Product Detail'
              get serializer: ::Products::ProductSerializer do
                result = ::Products::FindProduct.call(params[:id])

                if result.succeed?
                  result.response
                else
                  error!({ message: result.message, errors: result.errors }, result.code)
                end
              end

              desc 'Delete Seller'
              delete do
                status 204

                result = ::Cms::Products::DeleteProduct.call(params[:id])

                error!({ message: result.message, errors: result.errors }, result.code) unless result.succeed?
              end
            end
          end

          namespace :sellers do
            route_param :seller_id, allow_blank: false, type: Integer do
              namespace :products do
                desc 'Seller Products List'
                params do
                  use :pagination
                  use :search
                end
                get each_serializer: ::Products::ProductSerializer do
                  result = ::Cms::Products::ProductsBySeller.call(params[:seller_id])

                  if result.succeed?
                    if params[:q].present?
                      paginate result.response
                                 .includes(:active_assets, :category, :seller, products_units: [:unit])
                                 .full_text_search(params[:q])
                                 .page(params[:page]).per(params[:per_page])
                    else
                      paginate result.response
                                 .includes(:active_assets, :category, :seller, products_units: [:unit])
                                 .page(params[:page]).per(params[:per_page])
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
                  optional :units, type: Array, allow_blank: false do
                    requires :unit_id, type: Integer, allow_blank: false
                    requires :price, type: BigDecimal, allow_blank: false
                    requires :quantity, allow_blank: false, type: Integer
                    requires :name, allow_blank: false, type: String
                  end
                end
                post serializer: ::Products::ProductSerializer do
                  status 201

                  if request.env['CONTENT_TYPE'] == 'application/json'
                    params.except!(:image)
                  end

                  result = ::Cms::Products::CreateProduct.call(params)

                  if result.succeed?
                    result.response
                  else
                    error!({ message: result.message, errors: result.errors }, result.code)
                  end
                end

                route_param :id, allow_blank: false, type: Integer do
                  desc 'Seller Product Detail'
                  get serializer: ::Products::ProductSerializer do
                    result = ::Cms::Products::FindProductBySeller.call(params[:seller_id], params[:id])

                    if result.succeed?
                      result.response
                    else
                      error!({ message: result.message, errors: result.errors }, result.code)
                    end
                  end

                  desc 'Update Product'
                  params do
                    optional :name, allow_blank: false, type: String
                    optional :category_id, allow_blank: false, type: Integer
                    optional :description, allow_blank: false, type: String
                    optional :images, type: Array[File], allow_blank: false
                    optional :units, type: Array, allow_blank: false do
                      optional :unit_id, type: Integer, allow_blank: false
                      optional :price, type: BigDecimal, allow_blank: false
                      optional :quantity, allow_blank: false, type: Integer
                      optional :name, allow_blank: false, type: String
                    end
                  end
                  put do
                    status 204

                    if request.env['CONTENT_TYPE'] == 'application/json'
                      params.except!(:image)
                    end

                    result = ::Cms::Products::UpdateProduct.call(params)

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

                      result = ::Cms::Products::AddNewImage.call(params)

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

                      result = ::Cms::Products::DeleteImage.call(params)

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
end
