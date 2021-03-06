module Cms::Products
  class DeleteProduct < ::BaseService
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'Product Error'.freeze

    def initialize(id)
      self.id = id
    end

    def call
      product = Product.find_by(id: id)

      return error(response: product, message: 'Product not found',
                   code: 404, title: ERROR_TITLE) unless product

      product.destroy!

      success
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'Product could not be deleted', errors: e.record.errors)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 422)
    end
  end
end
