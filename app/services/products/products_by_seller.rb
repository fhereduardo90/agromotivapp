module Products
  class ProductsBySeller < ::BaseService
    attribute :current_user, Seller, writer: :private

    ERROR_TITLE = 'Product Error'.freeze

    def initialize(current_user)
      self.current_user = current_user
    end

    def call
      success(current_user.products)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 422)
    end
  end
end
