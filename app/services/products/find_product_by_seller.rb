module Products
  class FindProductBySeller < ::BaseService
    attribute :current_user, Seller, writer: :private
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'Product Error'.freeze

    def initialize(current_user, id)
      self.current_user = current_user
      self.id = id
    end

    def call
      product = current_user.products.find_by(id: id)

      return error(response: product, message: 'Product not found',
                   code: 404, title: ERROR_TITLE) unless product

      success(product)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 422)
    end
  end
end
