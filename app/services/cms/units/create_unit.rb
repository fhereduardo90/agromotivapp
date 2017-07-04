module Cms
  module Units
    class CreateUnit < ::BaseService
      attribute :current_admin, Admin, writer: :private
      attribute :unit_params, Hash, writer: :private

      ERROR_TITLE = 'Unit Error'.freeze

      def initialize(current_admin, unit_params = {})
        self.current_admin = current_admin
        self.unit_params = unit_params
      end

      def call
        success(current_admin.units.create!(unit_params))
      rescue ActiveRecord::RecordInvalid => e
        return error(response: e.record, title: ERROR_TITLE, code: 422,
                     message: 'Unit could not be created', errors: e.record.errors)
      rescue => e
        return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end
