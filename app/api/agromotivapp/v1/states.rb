module Agromotivapp
  module V1
    class States < Base
      namespace :states do
        desc 'States List'
        get each_serializer: ::States::StateSerializer do
          State.all
        end

        desc 'State Detail'
        params do
          requires :id, type: Integer, allow_blank: false
        end
        get ':id', serializer: ::States::StateSerializer do
          result = ::States::FindState.call(params[:id])

          if result.succeed?
            result.response
          else
            error!({ message: result.message, errors: result.errors }, result.code)
          end
        end

        route_param :state_id, allow_blank: false, type: Integer do
          namespace :cities do
            desc 'State Cities'
            get each_serializer: ::States::CitySerializer do
              result = ::States::FindCitiesByState.call(params[:state_id])

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            params do
              requires :id, allow_blank: false, type: Integer
            end
            desc 'State City Detail'
            get ':id', serializer: ::States::CitySerializer do
              result = ::States::FindCityByState.call(state_id: params[:state_id], id: params[:id])

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