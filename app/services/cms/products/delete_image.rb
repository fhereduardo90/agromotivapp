module Cms
  module Products
    class DeleteImage < ::BaseService
      attribute :seller_id, Integer, writer: :private
      attribute :product_id, Integer, writer: :private
      attribute :id, Integer, writer: :private

      ERROR_TITLE = 'Product Error'.freeze

      def initialize(options = {})
        self.seller_id = options[:seller_id]
        self.product_id = options[:product_id]
        self.id = options[:id]
      end

      def call
        seller = Seller.find_by(id: seller_id)

        return error(reponse: seller, title: ERROR_TITLE,
                     code: 404, message: 'Seller not found') unless seller

        product = seller.products.find_by(id: product_id)

        return error(response: product, title: ERROR_TITLE, code: 404,
                     message: 'Product not found') unless product

        image = product.assets.find_by(id: id)

        return error(response: image, title: ERROR_TITLE, code: 404,
                     message: 'Product Image not found') unless image

        image.destroy!

        success(product)
      rescue ActiveRecord::RecordInvalid => e
        return error(response: e.record, title: ERROR_TITLE, code: 422,
                     message: 'Product Image could not be deleted', errors: e.record.errors)
      rescue => e
        return error(response: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end