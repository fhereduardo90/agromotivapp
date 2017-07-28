module Cms
  module Admins
    class FindAdmin < ::BaseService
      attribute :id, Integer, writer: :private

      ERROR_TITLE = 'Admin Error'.freeze

      def initialize(id)
        self.id = id
      end

      def call
        admin = Admin.find_by(id: id)

        return error(response: admin, title: ERROR_TITLE, code: 404,
                     message: 'Admin not found') unless admin

        success(admin)
      rescue => e
        return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end
