Rails.application.routes.draw do
  devise_for :admins, skip: :all
  devise_for :users, skip: :all
  devise_for :sellers, skip: :all

  scope 'v1' do
    use_doorkeeper do
      skip_controllers :applications, :authorized_applications, :authorizations
    end
  end

  constraints subdomain: 'api' do
    mount Agromotivapp::API => '/'
    mount GrapeSwaggerRails::Engine => '/apidoc'
  end

  constraints subdomain: '' do
    root to: 'welcome#index'
    get '*path', to: 'welcome#index'
  end
end
