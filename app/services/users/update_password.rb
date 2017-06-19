module Users
  class UpdatePassword < ::BaseService
    attribute :current_user, User, writer: :private
    attribute :password, String, writer: :private
    attribute :password_confirmation, String, writer: :private

    ERROR_TITLE = 'User Error'.freeze

    def initialize(current_user, options = {})
      self.current_user = current_user
      self.password = options[:password]
      self.password_confirmation = options[:password_confirmation]
    end

    def call
      current_user.update!(password: password, password_confirmation: password_confirmation)
      success(current_user)
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'User\' password could not be updated', errors: e.record.errors)
    rescue => e
      return error(title: ERROR_TITLE, message: e.message)
    end
  end
end
