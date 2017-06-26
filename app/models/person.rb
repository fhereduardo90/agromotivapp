class Person < ApplicationRecord
  rolify

  has_one :asset, -> { where deleted: false }, as: :attachable
  has_many :assets, as: :attachable, dependent: :destroy

  validates :email, uniqueness: true, if: :valid_user?
  validates :email, format: Devise::email_regexp

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
    add_role(:user) if roles.blank?
  end

  private

  def valid_user?
    return false unless email_changed?
    self.class.name == 'User' && Person.with_role(:user).select(:id).find_by(email: email).present?
  end
end
