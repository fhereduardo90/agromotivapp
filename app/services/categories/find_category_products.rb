module Categories
  class FindCategoryProducts < ::BaseService
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'Category Error'.freeze

    def initialize(id)
      self.id = id
    end

    def call
      result = FindCategory.call(id)

      return error(result) unless result.succeed?

      success(result.response.products
                .includes(:active_assets, products_units: [:unit]))
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 404)
    end
  end
end
