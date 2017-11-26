module Passwords
  class SendInstructions < ::BaseService
    ERROR_TITLE = 'Password Error'.freeze

    attribute :klass, String, writer: :private
    attribute :email, String, writer: :private

    def initialize(klass, email)
      self.klass = klass
      self.email = email
    end

    def call
      entity = klass.camelize.constantize.send_reset_password_instructions(email: email)

      unless entity.errors.empty?
        return error(
          title: ERROR_TITLE,
          code: 404,
          message: 'Instructions could not be sent',
          errors: entity.errors
        )
      end

      success(entity)
    rescue => e
      return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
    end
  end
end