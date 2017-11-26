class User < Person
  include PgSearch

  pg_search_scope :full_text_search, against: [:name, :email], using: {
    tsearch: { prefix: true }
  }

  has_many :assets, -> { where attachable_type: 'User' },
           foreign_type: :attachable_type, foreign_key: :attachable_id, dependent: :destroy
  has_one :asset,  -> { where attachable_type: 'User', deleted: false },
          foreign_type: :attachable_type, foreign_key: :attachable_id, dependent: :destroy

  validates :email, uniqueness: true, if: :valid_user?

  def devise_mailer
    AgromotivaMailer
  end

  protected

  def assign_default_role
    add_role(:user) if roles.blank?
  end

  private

  def valid_user?
    return false unless email_changed?
    User.with_role(:user).select(:id).find_by(email: email).present?
  end

  def store_name=(value)
    super(value)
  end
end
