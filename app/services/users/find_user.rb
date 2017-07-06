module Users
  class FindUser < ::BaseService
    attribute :id, Integer, writer: :private

    ERROR_TITLE = 'User Error'.freeze

    def initialize(id)
      self.id = id
    end

    def call
      user = User.find_by(id: id)

      return error(response: user, title: ERROR_TITLE, code: 404,
                   message: 'User not found') unless user

      success(user)
    rescue => e
      return error(reponse: e, title: ERROR_TITLE, message: e.message,
                   code: 422)
    end
  end
end
