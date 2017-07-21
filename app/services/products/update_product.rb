module Products
  class UpdateProduct < ::BaseService
    attribute :current_user, Seller, writer: :private
    attribute :id, Integer, writer: :private
    attribute :product_params, Hash, writer: :private

    ERROR_TITLE = 'Product Error'.freeze

    def initialize(current_user, options = {})
      self.current_user = current_user
      self.id = options[:id]
      self.product_params = options.except!(:id)
    end

    def call
      new_units = []
      new_images = []
      product = current_user.products.find_by(id: id)

      return error(response: product, message: 'Product not found', code: 404,
                   title: ERROR_TITLE) unless product

      ActiveRecord::Base.transaction do
        product.update!(product_params.except('images', 'units'))

        unless product_params['units'].blank?
          new_units = product_params['units'].map { |unit|
            {
              unit_id: unit['unit_id'],
              price: unit['price'],
              quantity: unit['quantity'],
              name: unit['name']
            }
          }

          product.products_units.destroy_all
          product.products_units.create!(new_units)
        end

        unless product_params['images'].blank?
          new_images = product_params['images'].map{ |image|
            { image: ActionDispatch::Http::UploadedFile.new(image['file']) }
          }

          product.assets.create!(new_images)
        end
      end

      success
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'Product could not be updated', errors: e.record.errors)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 422)
    end
  end
end
