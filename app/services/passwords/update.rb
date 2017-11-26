module Passwords
  class Update < ::BaseService
    ERROR_TITLE = 'Password Error'.freeze

    attribute :klass, String, writer: :private
    attribute :reset_password_token, String, writer: :private

    def initialize(klass, reset_password_token, params)
      self.klass = klass
      self.reset_password_token = reset_password_token
      super(params)
    end

    def call
      entity = klass.camelize.constantize.find_by(reset_password_token: reset_password_token)

      return error(
        title: ERROR_TITLE,
        code: 404,
        message: 'Token is invalid'
      ) unless entity

      entity.reset_password(params['password'], params['password_confirmation'])

      if entity.errors.present?
        raise ActiveRecord::RecordInvalid.new(entity)
      end

      success
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'Password could not be updated', errors: e.record.errors)
    rescue => e
      return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
    end
  end
end