module Cms
  module Products
    class ProductsBySeller < ::BaseService
      attribute :seller_id, Integer, writer: :private

      ERROR_TITLE = 'Products Error'.freeze

      def initialize(seller_id)
        self.seller_id = seller_id
      end

      def call
        seller = Seller.find_by(id: seller_id)

        return error(response: seller, title: ERROR_TITLE, code: 404,
                     message: 'Seller not found') unless seller

        success(seller.products
                  .includes(:seller, :category, :active_assets, products_units: [:unit]))
      rescue => e
        return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end
