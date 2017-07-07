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

            desc 'Seller Detail'
            params do
              requires :id, allow_blank: false, type: Integer
            end
            get ':id', serializer: ::Sellers::SellerSerializer, include: '**' do
              result = ::Sellers::FindSeller.call(params[:id])

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
