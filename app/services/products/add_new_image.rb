module Products
  class AddNewImage < ::BaseService
    attribute :current_seller, Seller, writer: :private
    attribute :product_id, Integer, writer: :private
    attribute :image, Tempfile, writer: :private

    ERROR_TITLE = 'Product Error'.freeze

    def initialize(current_seller, product_id, image)
      self.current_seller = current_seller
      self.product_id = product_id
      self.image = image
    end

    def call
      product = current_seller.products.find_by(id: product_id)

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