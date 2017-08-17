GrapeSwaggerRails.options.before_action do |request|
  GrapeSwaggerRails.options.app_url = request.protocol + request.host_with_port
end

GrapeSwaggerRails.options.url = '/swagger_doc.json'
GrapeSwaggerRails.options.api_auth     = 'bearer'
GrapeSwaggerRails.options.api_key_name = 'Authorization'
GrapeSwaggerRails.options.api_key_type = 'header'