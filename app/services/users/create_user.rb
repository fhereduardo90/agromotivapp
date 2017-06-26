module Users
  class CreateUser < ::BaseService
    attribute :name, String, writer: :private
    attribute :email, String, writer: :private
    attribute :address, String, writer: :private
    attribute :phone, String, writer: :private
    attribute :password, String, writer: :private
    attribute :password_confirmation, String, writer: :private
    attribute :state_id, Integer, writer: :private, required: false 
    attribute :city_id, Integer, writer: :private, required: false

    ERROR_TITLE = 'User Error'.freeze

    def initialize(options = {})
      self.name = options[:name]
      self.email = options[:email]
      self.address = options[:address]
      self.phone = options[:phone]
      self.password = options[:password]
      self.password_confirmation = options[:password_confirmation]
      self.state_id = options[:state_id]
      self.city_id = options[:city_id]
    end

    def call
      token = nil
      user = User.new(
        name: name, email: email, address: address, phone: phone,
        password: password, password_confirmation: password_confirmation,
        state_id: state_id, city_id: city_id
      )

      ActiveRecord::Base.transaction do
        user.save!
        token = get_access_token(user, 'user')
      end

      success(token)
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'User could not be created', errors: e.record.errors)
    rescue => e
      return error(title: ERROR_TITLE, message: e.message)
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
