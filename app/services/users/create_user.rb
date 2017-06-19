module Users
  class CreateUser < ::BaseService
    attribute :name, String, writer: :private
    attribute :email, String, writer: :private
    attribute :address, String, writer: :private
    attribute :phone, String, writer: :private
    attribute :password, String, writer: :private
    attribute :password_confirmation, String, writer: :private

    ERROR_TITLE = 'User Error'.freeze

    def initialize(options = {})
      self.name = options[:name]
      self.email = options[:email]
      self.address = options[:address]
      self.phone = options[:phone]
      self.password = options[:password]
      self.password_confirmation = options[:password_confirmation]
    end

    def call
      token = nil
      user = User.new(
        name: name, email: email, address: address, phone: phone,
        password: password, password_confirmation: password_confirmation
      )

      ActiveRecord::Base.transaction do
        user.save!
        token = Doorkeeper::AccessToken.create!(
          resource_owner_id: user.id,
          use_refresh_token: true, scopes: 'public',
          expires_in: Doorkeeper.configuration.access_token_expires_in
        )
      end

      success(token)
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'User could not be created', errors: e.record.errors)
    rescue => e
      return error(title: ERROR_TITLE, message: e.message)
    end
  end
end
