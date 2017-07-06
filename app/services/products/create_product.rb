module Products
  class CreateProduct < ::BaseService
    attribute :current_user, Seller, writer: :private
    attribute :name, String, writer: :private
    attribute :category_id, Integer, writer: :private
    attribute :description, String, writer: :private, required: false
    attribute :images, Array, writer: :private
    attribute :units, Array, writer: :private

    ERROR_TITLE = 'Product Error'.freeze

    def initialize(current_user, options = {})
      self.current_user = current_user
      self.name = options[:name]
      self.category_id = options[:category_id]
      self.description = options[:description]
      self.images = options[:images]
      self.units = options[:units]
    end

    def call
      ActiveRecord::Base.transaction do
        product = current_user.products.create!(
          name: name,
          description: description,
          category_id: category_id
        )
        unless units.blank?
          units_parsed = units.map{ |unit|
            {
              unit_id: unit['unit_id'],
              price: unit['price'],
              quantity: unit['quantity']
            }
          }
          product.products_units.create!(units_parsed)
        end
        unless images.blank?
          images_parsed = images.map{ |image|
            { image: ActionDispatch::Http::UploadedFile.new(image['file']) }
          }
          product.assets.create!(images_parsed)
        end

        success(product)
      end
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'Product could not be created', errors: e.record.errors)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 422)
    end
  end
end
