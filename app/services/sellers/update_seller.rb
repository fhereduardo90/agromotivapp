module Sellers
  class UpdateSeller < ::Users::UpdateUser

    ERROR_TITLE = 'Seller Error'.freeze

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
                   message: 'Seller could not be updated', errors: e.record.errors)
    end
  end
end
