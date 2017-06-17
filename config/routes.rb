Rails.application.routes.draw do
  devise_for :users, skip: :all
  mount Agromotivapp::API => '/'
end
