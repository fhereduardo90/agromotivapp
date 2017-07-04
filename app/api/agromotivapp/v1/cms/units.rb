module Agromotivapp
  module V1
    module Cms
      class Units < ::Agromotivapp::V1::Root
        namespace :cms do
          namespace :units do
            before do
              doorkeeper_authorize! :admin
            end

            desc 'Units List'
            get each_serializer: ::Cms::Units::UnitSerializer do
              Unit.all
            end

            desc 'Create Unit'
            params do
              requires :name, allow_blank: false, type: String
              optional :description, allow_blank: false, type: String
            end
            post serializer: ::Cms::Units::UnitSerializer do
              status 201

              result = ::Cms::Units::CreateUnit.call(current_resource_owner, params)

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            namespace ':id' do
              desc 'Unit Detail'
              params do
                requires :id, allow_blank: false, type: Integer
              end
              get serializer: ::Cms::Units::UnitSerializer do
                result = ::Units::FindUnit.call(params[:id])

                if result.succeed?
                  result.response
                else
                  error!({ message: result.message, errors: result.errors }, result.code)
                end
              end

              desc 'Update Unit'
              params do
                requires :id, allow_blank: false, type: Integer
                optional :name, allow_blank: false, type: String
                optional :description, allow_blank: false, type: String
              end
              put do
                status 204

                result = ::Cms::Units::UpdateUnit.call(current_resource_owner, params)

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
end
