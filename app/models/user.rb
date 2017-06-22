class User < ApplicationRecord
  rolify

  has_one :asset, -> { where deleted: false }, as: :attachable
  has_many :assets, as: :attachable

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  after_create :assign_default_role

  def assign_default_role
    add_role(:user) if roles.blank?
  end
end
