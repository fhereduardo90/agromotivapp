class User < Person
  has_many :assets, -> { where attachable_type: 'User' },
           foreign_type: :attachable_type, foreign_key: :attachable_id
  has_one :asset,  -> { where attachable_type: 'User', deleted: false },
          foreign_type: :attachable_type, foreign_key: :attachable_id

  validates :email, uniqueness: true, if: :valid_user?

  protected

  def assign_default_role
    add_role(:user) if roles.blank?
  end

  private

  def valid_user?
    return false unless email_changed?
    User.with_role(:user).select(:id).find_by(email: email).present?
  end
end