module Products
  class DeleteImage < ::BaseService
    attribute :current_seller, Seller, writer: :private
    attribute :product_id, Integer, writer: :private
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'Product Error'.freeze

    def initialize(current_seller, product_id, id)
      self.current_seller = current_seller
      self.product_id = product_id
      self.id = id
    end

    def call
      product = current_seller.products.find_by(id: product_id)

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