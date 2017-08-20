module Agromotivapp
  module V1
    class Units < Base
      namespace :units do
        before do
          doorkeeper_authorize! :seller
        end

        desc 'Units List'
        params do
          use :pagination
        end
        get each_serializer: ::Units::UnitSerializer do
          paginate Unit.page(params[:page]).per(params[:per_page])
        end

        params do
          requires :id, allow_blank: false, type: Integer
        end
        desc 'Unit Detail'
        get ':id', serializer: ::Units::UnitSerializer do
          result = ::Units::FindUnit.call(params[:id])

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