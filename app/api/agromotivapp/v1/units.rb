module Agromotivapp
  module V1
    class Units < Root
      namespace :units do
        before do
          doorkeeper_authorize! :seller
        end

        desc 'Units List'
        get each_serializer: ::Units::UnitSerializer do
          Unit.all
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