module Cms::Units
  class DeleteUnit < ::BaseService
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'Unit Error'.freeze

    def initialize(id)
      self.id = id
    end

    def call
      unit = Unit.find_by(id: id)

      return error(response: unit, title: ERROR_TITLE, code: 404,
                   message: 'Unit not found') unless unit

      unit.destroy!

      success
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'Unit could not be deleted', errors: e.record.errors)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 404)
    end
  end
end
