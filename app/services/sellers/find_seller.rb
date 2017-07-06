module Sellers
  class FindSeller < ::BaseService
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'Seller Error'.freeze

    def initialize(id)
      self.id = id
    end

    def call
      seller = Seller.find_by(id: id)

      return error(response: seller, title: ERROR_TITLE, code: 404,
                   message: 'Seller not found') unless seller

      success(seller)
    rescue => e
      return error(reponse: e, title: ERROR_TITLE, message: e.message,
                   code: 422)
    end
  end
end
