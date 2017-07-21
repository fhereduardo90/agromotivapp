module Cms::Sellers
  class DeleteSeller < ::BaseService
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'Seller Error'.freeze

    def initialize(id)
      self.id = id
    end

    def call
      seller = Seller.find_by(id: id)

      return error(response: seller, title: ERROR_TITLE, code: 404,
                   message: 'Seller not found') unless seller

      seller.destroy!

      success
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'Seller could not be deleted', errors: e.record.errors)
    rescue => e
      return error(response: e, title: ERROR_TITLE, message: e.message, code: 404)
    end
  end
end
