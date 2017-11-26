module Agromotivapp
  module V1
    class Passwords < Base
      namespace :passwords do
        namespace :clients do
          desc 'Send instructions to user for recovering password'
          params do
            requires :email, allow_blank: false, regexp: Devise::email_regexp, type: String
          end
          post do
            status 204

            result = ::Passwords::SendInstructions.call('user', params[:email])

            error!({message: result.message, errors: result.errors },
                   result.code) unless result.succeed?
          end

          desc 'Update User Password'
          params do
            requires :reset_password_token, allow_blank: false, type: String
            requires :password, allow_blank: false, type: String,
                     documentation: { required: true, type: 'password' }
            given :password do
              requires :password_confirmation, allow_blank: false, type: String,
                       documentation: { required: true, type: 'password' }
            end
          end

          patch do
            status 204

            result = ::Passwords::Update.call(
              'user',
              params[:reset_password_token],
              params.except(:reset_password_token)
            )

            error!({ message: result.message, errors: result.errors },
                   result.code) unless result.succeed?
          end
        end

        namespace :sellers do
          desc 'Send instructions to seller for recovering password'
          params do
            requires :email, allow_blank: false, regexp: Devise::email_regexp, type: String
          end
          post do
            status 204

            result = ::Passwords::SendInstructions.call('seller', params[:email])

            error!({message: result.message, errors: result.errors },
                   result.code) unless result.succeed?
          end

          desc 'Update User Password'
          params do
            requires :reset_password_token, allow_blank: false, type: String
            requires :password, allow_blank: false, type: String,
                     documentation: { required: true, type: 'password' }
            given :password do
              requires :password_confirmation, allow_blank: false, type: String,
                       documentation: { required: true, type: 'password' }
            end
          end

          patch do
            status 204

            result = ::Passwords::Update.call(
              'seller',
              params[:reset_password_token],
              params.except(:reset_password_token)
            )

            error!({ message: result.message, errors: result.errors },
                   result.code) unless result.succeed?
          end
        end
      end
    end
  end
end