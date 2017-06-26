module States
  class FindCityByState < ::BaseService
    attribute :state_id, Integer, writer: :private
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'State Error'.freeze

    def initialize(params = {})
      self.state_id = params[:state_id]
      self.id = params[:id]
    end

    def call
      state = State.find_by(id: state_id)

      return error(response: nil, title: ERROR_TITLE, code: 404,
                   message: 'State not found') unless state

      city = state.cities.find_by(id: id)

      return error(response: nil, title: ERROR_TITLE, code: 404,
                   message: 'City not found') unless city

      success(city)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 404)
    end
  end
end
