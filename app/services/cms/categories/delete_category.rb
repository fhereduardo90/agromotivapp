module Cms::Categories
  class DeleteCategory < ::BaseService
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'Category Error'.freeze

    def initialize(id)
      self.id = id
    end

    def call
      category = Category.find_by(id: id)

      return error(response: category, title: ERROR_TITLE, code: 404,
                   message: 'Category not found') unless category

      category.destroy!

      success
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'Category could not be deleted', errors: e.record.errors)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 404)
    end
  end
end
