Rails.application.routes.draw do
  devise_for :admins
  devise_for :users, skip: :all

  scope 'v1' do
    use_doorkeeper do
      skip_controllers :applications, :authorized_applications, :authorizations
    end
  end

  get '/apidoc', to: redirect('/swagger/index.html?url=/v1/swagger_doc')

  mount Agromotivapp::API => '/'
end
