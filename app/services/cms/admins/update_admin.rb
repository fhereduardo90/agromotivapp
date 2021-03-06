module Cms
  module Admins
    class UpdateAdmin < ::BaseService
      attribute :id, Integer, writer: :private
      attribute :admin_params, Hash, writer: :private

      ERROR_TITLE = 'Admin Error'.freeze

      def initialize(admin_params = {})
        self.id = admin_params[:id]
        self.admin_params = admin_params.except(:id)
      end

      def call
        admin = Admin.find_by(id: id)

        return error(response: admin, title: ERROR_TITLE, code: 404,
                     message: 'Admin not found') unless admin

        success admin.update!(admin_params)
      rescue ActiveRecord::RecordInvalid => e
        return error(response: e.record, title: ERROR_TITLE, code: 422,
                     message: 'Admin could not be updated', errors: e.record.errors)
      rescue => e
        return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end
