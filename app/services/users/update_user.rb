module Users
  class UpdateUser < ::BaseService
    attribute :current_user, User, writer: :private
    attribute :user_params, Hash, writer: :private

    ERROR_TITLE = 'User Error'.freeze

    def initialize(current_user, user_params = {})
      self.current_user = current_user
      self.user_params = user_params
    end

    def call
      current_user.update!(user_params)
      success(current_user)
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'User could not be updated', errors: e.record.errors)
    rescue => e
      return error(title: ERROR_TITLE, message: e.message)
    end
  end
end
