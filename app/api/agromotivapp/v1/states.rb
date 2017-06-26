module Agromotivapp
  module V1
    class States < Root
      namespace :states do
        desc 'States List'
        get each_serializer: ::States::StateSerializer do
          State.all
        end

        params do
          requires :id, allow_blank: false, type: Integer
        end
        desc 'State Detail'
        get ':id', serializer: ::States::StateSerializer do
          result = ::States::FindState.call(params[:id])

          if result.succeed?
            result.response
          else
            error!({ message: result.message, errors: result.errors }, result.code)
          end
        end

        namespace ':state_id' do
          params do
            requires :state_id, allow_blank: false, type: Integer
          end
          namespace :cities do
            desc 'State\'s cities'
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
            desc 'State\'s city detail'
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