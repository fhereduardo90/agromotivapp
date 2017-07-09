module Cms::Users
  class DeleteUser < ::BaseService
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'User Error'.freeze

    def initialize(id)
      self.id = id
    end

    def call
      user = User.find_by(id: id)

      return error(response: user, title: ERROR_TITLE, code: 404,
                   message: 'User not found') unless user

      user.destroy!

      success
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'User could not be deleted', errors: e.record.errors)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 404)
    end
  end
end
