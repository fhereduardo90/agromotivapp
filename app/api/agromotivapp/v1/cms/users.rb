module Agromotivapp
  module V1
    module Cms
      class Users < ::Agromotivapp::V1::Root
        namespace :cms do
          namespace :users do
            before do
              doorkeeper_authorize! :admin
            end

            desc 'Users List'
            get each_serializer: ::Users::UserSerializer, include: '**' do
              User.all
            end

            desc 'User Detail'
            params do
              requires :id, allow_blank: false, type: Integer
            end
            get ':id', serializer: ::Users::UserSerializer, include: '**' do
              result = ::Users::FindUser.call(params[:id])

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end
          end
        end
      end
    end
  end
end
