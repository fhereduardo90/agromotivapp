module Cms
  module Units
    class UpdateUnit < CreateUnit
      attribute :id, Integer, writer: :private

      ERROR_TITLE = 'Unit Error'.freeze

      def initialize(current_admin, unit_params = {})
        self.id = unit_params[:id]
        super(current_admin, unit_params.slice(:name, :description))
      end

      def call
        unit = Unit.find_by(id: id)

        return error(response: unit, title: ERROR_TITLE,
                     message: 'Unit not found', code: 404) unless unit

        unit.update!(unit_params)
        success(unit)
      rescue ActiveRecord::RecordInvalid => e
        return error(response: e.record, title: ERROR_TITLE, code: 422,
                     message: 'Unit could not be updated', errors: e.record.errors)
      rescue => e
        return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end
