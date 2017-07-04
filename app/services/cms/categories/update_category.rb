module Cms
  module Categories
    class UpdateCategory < CreateCategory
      attribute :id, Integer, writer: :private

      ERROR_TITLE = 'Category Error'.freeze

      def initialize(current_admin, category_params = {})
        self.current_admin = current_admin
        self.image = category_params[:image]
        self.id = category_params[:id]
        self.category_params = category_params.slice(:name, :description)
      end

      def call
        category = Category.find_by(id: id)

        return error(response: category, title: ERROR_TITLE,
                     message: 'Category not found', code: 404) unless category

        ActiveRecord::Base.transaction do
          category.update!(category_params)

          if image.present?
            category.assets.update_all(deleted: true)
            category.assets.create!(
              image: ActionDispatch::Http::UploadedFile.new(image)
            )
          end
        end

        success(category)
      rescue ActiveRecord::RecordInvalid => e
        return error(response: e.record, title: ERROR_TITLE, code: 422,
                     message: 'Category could not be updated', errors: e.record.errors)
      rescue => e
        return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end
