class Person < ApplicationRecord
  rolify

  belongs_to :state, optional: true
  belongs_to :city, optional: true

  validates :email, format: Devise::email_regexp
  validates :state, presence: true, unless: -> { self.city.present? }
  validates :city, presence: true, unless: -> { self.state.present? }

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  before_validation :assign_default_role, on: :create

  protected

  # Disabling devise email's uniqueness validation
  def will_save_change_to_email?
    false
  end

  def assign_default_role
    raise NoImplementedError
  end
end
