module Users
  class CreateUser < ::BaseService

    ERROR_TITLE = 'User Error'.freeze

    attribute :user_params, Hash, writer: :private

    def initialize(options = {})
      self.user_params = options
    end

    def call
      token = nil
      user = User.new(user_params)

      ActiveRecord::Base.transaction do
        user.save!
        token = get_access_token(user, 'user')
      end

      success(token)
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'User could not be created', errors: e.record.errors)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 422)
    end

    private

    def get_access_token(resource, scope)
      Doorkeeper::AccessToken.create!(
        resource_owner_id: resource.id,
        use_refresh_token: true, scopes: scope,
        expires_in: Doorkeeper.configuration.access_token_expires_in
      )
    end
  end
end
