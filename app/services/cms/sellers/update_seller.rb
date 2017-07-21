module Cms::Sellers
  class UpdateSeller < ::BaseService
    attribute :id, Integer, writer: :private
    attribute :seller_params, Hash, writer: :private
    attribute :image, Tempfile, writer: :private, required: false

    ERROR_TITLE = 'Seller Error'.freeze

    def initialize(seller_params = {})
      self.id = seller_params[:id]
      self.image = seller_params[:image]
      self.seller_params = seller_params.except(:image, :id)
    end

    def call
      seller = Seller.find_by(id: id)

      return error(response: seller, title: ERROR_TITLE, code: 404,
                   message: 'Seller not found') unless seller

      ActiveRecord::Base.transaction do
        seller.update!(seller_params)

        if image.present?
          seller.assets.update_all(deleted: true)
          seller.assets.create!(
            image: ActionDispatch::Http::UploadedFile.new(image),
            deleted: false
          )
        end
      end

      success
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'Seller could not be updated', errors: e.record.errors)
    rescue => e
      return error(reponse: e, title: ERROR_TITLE, message: e.message, code: 422)
    end
  end
end
