module Cms::Users
  class CreateUser < ::BaseService
    attribute :user_params, Hash, writer: :private
    attribute :image, Tempfile, writer: :private, required: false

    ERROR_TITLE = 'User Error'.freeze

    def initialize(options = {})
      self.image = options[:image]
      self.user_params = options.except(:image)
    end

    def call
      user = User.create!(user_params)

      if image.present?
        user.assets.create!(
          image: ActionDispatch::Http::UploadedFile.new(image),
          deleted: false
        )
      end

      success(user)
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'User could not be created', errors: e.record.errors)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 422)
    end
  end
end
