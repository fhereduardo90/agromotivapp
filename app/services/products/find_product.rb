module Products
  class FindProduct < ::BaseService
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'Product Error'.freeze

    def initialize(id)
      self.id = id
    end

    def call
      product = Product
                  .includes(:seller, :category, :active_assets, products_units: [:unit])
                  .find_by(id: id)

      return error(response: product, message: 'Product not found',
                   code: 404, title: ERROR_TITLE) unless product

      success(product)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 422)
    end
  end
end
