module Units
  class FindUnit < ::BaseService
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'Unit Error'.freeze

    def initialize(id)
      self.id = id
    end

    def call
      unit = Unit.find_by(id: id)

      return error(response: unit, title: ERROR_TITLE, code: 404,
                   message: 'Unit not found') unless unit

      success(unit)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 404)
    end
  end
end
