module States
  class CitySerializer < StateSerializer
    belongs_to :state, serializer: StateSerializer
  end
end
