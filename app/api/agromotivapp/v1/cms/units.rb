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
            params do
              optional :page, type: Integer, allow_blank: false
              optional :per_page, type: Integer, allow_blank: false
            end
            get each_serializer: ::Cms::Units::UnitAdminSerializer do
              Unit.all.page(params[:page]).per(params[:per_page])
            end

            desc 'Create Unit'
            params do
              requires :name, allow_blank: false, type: String
              optional :description, allow_blank: false, type: String
            end
            post serializer: ::Cms::Units::UnitAdminSerializer do
              status 201

              result = ::Cms::Units::CreateUnit.call(current_resource_owner, params)

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            route_param :id, allow_blank: false, type: Integer do
              desc 'Unit Detail'
              get serializer: ::Cms::Units::UnitAdminSerializer do
                result = ::Units::FindUnit.call(params[:id])

                if result.succeed?
                  result.response
                else
                  error!({ message: result.message, errors: result.errors }, result.code)
                end
              end

              desc 'Update Unit'
              params do
                optional :name, allow_blank: false, type: String
                optional :description, allow_blank: false, type: String
              end
              put do
                status 204

                result = ::Cms::Units::UpdateUnit.call(current_resource_owner, params)

                error!({ message: result.message, errors: result.errors },
                       result.code) unless result.succeed?
              end

              desc 'Delete Unit'
              delete do
                status 204

                result = ::Cms::Units::DeleteUnit.call(params[:id])

                error!({ message: result.message, errors: result.errors },
                       result.code) unless result.succeed?
              end
            end
          end
        end
      end
    end
  end
end
