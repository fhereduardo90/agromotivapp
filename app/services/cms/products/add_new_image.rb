module Cms
  module Products
    class AddNewImage < ::BaseService
      attribute :seller_id, Integer, writer: :private
      attribute :product_id, Integer, writer: :private
      attribute :image, Tempfile, writer: :private

      ERROR_TITLE = 'Product Error'.freeze

      def initialize(options = {})
        self.seller_id = options[:seller_id]
        self.product_id = options[:product_id]
        self.image = options[:image]
      end

      def call
        seller = Seller.find_by(id: seller_id)

        return error(reponse: seller, title: ERROR_TITLE,
                     code: 404, message: 'Seller not found') unless seller

        product = seller.products.find_by(id: product_id)

        return error(response: product, title: ERROR_TITLE, code: 404,
                     message: 'Product not found') unless product


        product.assets.create!(image: ActionDispatch::Http::UploadedFile.new(image))

        success(product)
      rescue ActiveRecord::RecordInvalid => e
        return error(response: e.record, title: ERROR_TITLE, code: 422,
                     message: 'Product Image could not be added', errors: e.record.errors)
      rescue => e
        return error(response: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end