module Cms
  module Admins
    class CreateAdmin < ::BaseService
      attribute :admin_params, Hash, writer: :private

      ERROR_TITLE = 'Admin Error'.freeze

      def initialize(admin_params = {})
        self.admin_params = admin_params
      end

      def call
        success(Admin.create!(admin_params))
      rescue ActiveRecord::RecordInvalid => e
        return error(response: e.record, title: ERROR_TITLE, code: 422,
                     message: 'Admin could not be created', errors: e.record.errors)
      rescue => e
        return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end
