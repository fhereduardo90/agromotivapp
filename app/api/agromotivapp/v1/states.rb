module Agromotivapp
  module V1
    class States < Root
      namespace :states do
        desc 'States List'
        get each_serializer: ::States::StateSerializer do
          State.all
        end

        route_param :id, allow_blank: false, type: Integer do
          desc 'State Detail'
          get serializer: ::States::StateSerializer do
            result = ::States::FindState.call(params[:id])

            if result.succeed?
              result.response
            else
              error!({ message: result.message, errors: result.errors }, result.code)
            end
          end

          namespace :cities do
            desc 'State Cities'
            get each_serializer: ::States::CitySerializer do
              result = ::States::FindCitiesByState.call(params[:id])

              if result.succeed?
                result.response
              else
                error!({ message: result.message, errors: result.errors }, result.code)
              end
            end

            params do
              requires :city_id, allow_blank: false, type: Integer
            end
            desc 'State City Detail'
            get ':city_id', serializer: ::States::CitySerializer do
              result = ::States::FindCityByState.call(state_id: params[:id], id: params[:city_id])

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