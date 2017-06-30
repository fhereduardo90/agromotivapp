module Categories
  class FindCategory < ::BaseService
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'Category Error'.freeze

    def initialize(id)
      self.id = id
    end

    def call
      category = Category.find_by(id: id)

      return error(response: category, title: ERROR_TITLE, code: 404,
                   message: 'Category not found') unless category

      success(category)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 404)
    end
  end
end
