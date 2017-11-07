Rails.application.routes.draw do
  devise_for :admins
  devise_for :users, skip: :all

  scope 'v1' do
    use_doorkeeper do
      skip_controllers :applications, :authorized_applications, :authorizations
    end
  end

  constraints subdomain: 'api' do
    mount Agromotivapp::API => '/'
  end

  mount GrapeSwaggerRails::Engine => '/apidoc'
end
