module Agromotivapp
  module V1
    module Cms
      class Sellers < ::Agromotivapp::V1::Root
        namespace :cms do
          namespace :sellers do
            before do
              doorkeeper_authorize! :admin
            end

            desc 'Sellers List'
            get each_serializer: ::Sellers::SellerSerializer, include: '**' do
              Seller.all
            end

            route_param :id, allow_blank: false, type: Integer do
              desc 'Seller Detail'
              get serializer: ::Sellers::SellerSerializer, include: '**' do
                result = ::Sellers::FindSeller.call(params[:id])

                if result.succeed?
                  result.response
                else
                  error!({ message: result.message, errors: result.errors }, result.code)
                end
              end

              namespace :products do
                desc 'Seller Products'
                get each_serializer: ::Products::ProductSerializer do
                  result = ::Cms::Products::ProductsBySeller.call(params[:id])

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
                  result = ::Cms::Products::FindProductBySeller.call(params[:id], params[:product_id])

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
