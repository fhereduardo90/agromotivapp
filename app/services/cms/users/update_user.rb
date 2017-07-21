module Cms::Users
  class UpdateUser < ::BaseService
    attribute :id, Integer, writer: :private
    attribute :user_params, Hash, writer: :private
    attribute :image, Tempfile, writer: :private, required: false

    ERROR_TITLE = 'User Error'.freeze

    def initialize(user_params = {})
      self.id = user_params[:id]
      self.image = user_params[:image]
      self.user_params = user_params.except(:image, :id)
    end

    def call
      user = User.find_by(id: id)

      return error(response: user, title: ERROR_TITLE, code: 404,
                   message: 'User not found') unless user

      ActiveRecord::Base.transaction do
        user.update!(user_params)

        if image.present?
          user.assets.update_all(deleted: true)
          user.assets.create!(
            image: ActionDispatch::Http::UploadedFile.new(image),
            deleted: false
          )
        end
      end

      success
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'User could not be updated', errors: e.record.errors)
    rescue => e
      return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
    end
  end
end
