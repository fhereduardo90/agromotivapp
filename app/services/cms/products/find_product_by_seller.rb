module Cms
  module Products
    class FindProductBySeller < ::BaseService
      attribute :seller_id, Integer, writer: :private
      attribute :product_id, Integer, writer: :private

      ERROR_TITLE = 'Products Error'.freeze

      def initialize(seller_id, product_id)
        self.seller_id = seller_id
        self.product_id = product_id
      end

      def call
        seller = Seller.find_by(id: seller_id)

        return error(response: seller, title: ERROR_TITLE, code: 404,
                     message: 'Seller not found') unless seller

        product = seller.products.find_by(id: product_id)

        return error(response: product, title: ERROR_TITLE, code: 404,
                     message: 'Product not found') unless product

        success(product)
      rescue => e
        return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end
