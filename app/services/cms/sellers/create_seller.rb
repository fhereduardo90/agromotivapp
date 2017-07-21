module Cms::Sellers
  class CreateSeller < ::BaseService
    attribute :seller_params, Hash, writer: :private
    attribute :image, Tempfile, writer: :private, required: false

    ERROR_TITLE = 'Seller Error'.freeze

    def initialize(options = {})
      self.image = options[:image]
      self.seller_params = options.except(:image)
    end

    def call
      seller = Seller.create!(seller_params)

      if image.present?
        seller.assets.create!(
          image: ActionDispatch::Http::UploadedFile.new(image),
          deleted: false
        )
      end

      success(seller)
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'Seller could not be created', errors: e.record.errors)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 422)
    end
  end
end
