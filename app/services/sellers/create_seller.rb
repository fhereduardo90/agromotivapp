module Sellers
  class CreateSeller < ::Users::CreateUser

    ERROR_TITLE = 'Seller Error'.freeze

    def call
      token = nil
      seller = Seller.new(user_params)

      ActiveRecord::Base.transaction do
        seller.save!
        token = get_access_token(seller, 'seller')
      end

      success(token)
    rescue ActiveRecord::RecordInvalid => e
      return error(response: e.record, title: ERROR_TITLE, code: 422,
                   message: 'Seller could not be created', errors: e.record.errors)
    rescue => e
      return error(reponse: e, title: ERROR_TITLE, message: e.message,
                   code: 422)
    end
  end
end
