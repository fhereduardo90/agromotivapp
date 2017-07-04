module Cms
  module Admins
    class UpdateAdmin < ::BaseService
      attribute :current_admin, Admin, writer: :private
      attribute :admin_params, Hash, writer: :private

      ERROR_TITLE = 'Admin Error'.freeze

      def initialize(current_admin, admin_params = {})
        self.current_admin = current_admin
        self.admin_params = admin_params
      end

      def call
        current_admin.update!(admin_params)
        success
      rescue ActiveRecord::RecordInvalid => e
        return error(response: e.record, title: ERROR_TITLE, code: 422,
                     message: 'Admin could not be updated', errors: e.record.errors)
      rescue => e
        return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end
