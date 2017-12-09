class AgromotivaSubdomain
  def self.matches? request
    case request.subdomain
    when 'api'
      true
    when 'agromotivapp'
      true
    else
      false
    end
  end
end