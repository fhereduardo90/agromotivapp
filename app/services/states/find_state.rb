module States
  class FindState < ::BaseService
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'State Error'.freeze

    def initialize(id)
      self.id = id
    end

    def call
      state = State.find_by(id: id)

      return error(response: state, title: ERROR_TITLE, code: 404,
                   message: 'State not found') unless state

      success(state)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 404)
    end
  end
end
