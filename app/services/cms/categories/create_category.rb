module Cms
  module Categories
    class CreateCategory < ::BaseService
      attribute :current_admin, Admin, writer: :private
      attribute :category_params, Hash, writer: :private
      attribute :image, Tempfile, writer: :private, required: false

      ERROR_TITLE = 'Category Error'.freeze

      def initialize(current_admin, category_params = {})
        self.current_admin = current_admin
        self.image = category_params[:image]
        self.category_params = category_params.slice(:name, :description)
      end

      def call
        category = nil

        ActiveRecord::Base.transaction do
          category = current_admin.categories.create!(
            name: category_params['name'],
            description: category_params['description']
          )

          if image.present?
            category.assets.create!(
              image: ActionDispatch::Http::UploadedFile.new(image)
            )
          end
        end

        success(category)
      rescue ActiveRecord::RecordInvalid => e
        return error(response: e.record, title: ERROR_TITLE, code: 422,
                     message: 'Category could not be created', errors: e.record.errors)
      rescue => e
        return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
      end
    end
  end
end
