module Tokens
  class AccessTokenSerializer < ActiveModel::Serializer
    attributes :access_token, :token_type, :expires_in, :refresh_token, :created_at, :scope

    def access_token
      object.token
    end

    def scope
      object.scopes.first
    end

    def token_type
      'bearer'
    end

    def created_at
      object.created_at.to_i
    end
  end
end
