module Users
  class UpdateUser < ::BaseService
    attribute :current_user, User, writer: :private
    attribute :user_params, Hash, writer: :private
    attribute :image, Tempfile, writer: :private, required: false

    ERROR_TITLE = 'User Error'.freeze

    def initialize(current_user, user_params = {})
      self.current_user = current_user
      self.image = user_params[:image]
      self.user_params = user_params.except!(:image)
    end

    def call
      ActiveRecord::Base.transaction do
        current_user.update!(user_params)

        if image.present?
          current_user.assets.update_all(deleted: true)
          current_user.assets.create!(
            image: ActionDispatch::Http::UploadedFile.new(image),
            deleted: false
          )
        end
      end

      success(current_user)
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'User could not be updated', errors: e.record.errors)
    end
  end
end
