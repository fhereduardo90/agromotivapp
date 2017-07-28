module Cms
  module Admins
    class DeleteAdmin < ::BaseService
      attribute :current_admin, Admin, writer: :private
      attribute :id, Integer, writer: :private

      ERROR_TITLE = 'Admin Error'.freeze

      def initialize(current_admin, id)
        self.current_admin = current_admin
        self.id = id
      end

      def call
        admin = Admin.find_by(id: id)

        return error(response: admin, title: ERROR_TITLE, code: 404,
                     message: 'Admin not found') unless admin

        return error(response: admin, title: ERROR_TITLE, code: 422,
                     message: 'You cannot delete your own account') if current_admin.id == id

        success admin.destroy!
      rescue ActiveRecord::RecordInvalid => e
        return error(response: e.record, title: ERROR_TITLE, code: 422,
                     message: 'Admin could not be deleted', errors: e.record.errors)
      rescue => e
        return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end
