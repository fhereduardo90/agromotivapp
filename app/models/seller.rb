class Seller < Person
  include PgSearch

  pg_search_scope :full_text_search, against: [:name, :email, :store_name], using: {
    tsearch: { prefix: true }
  }

  has_many :assets, -> { where attachable_type: 'Seller' },
           foreign_type: :attachable_type, foreign_key: :attachable_id, dependent: :destroy
  has_one :asset, -> { where attachable_type: 'Seller', deleted: false },
          foreign_type: :attachable_type, foreign_key: :attachable_id, dependent: :destroy
  has_many :products, dependent: :destroy

  validates :email, uniqueness: true, if: :valid_seller?

  protected

  def assign_default_role
    add_role(:seller) if roles.blank?
  end

  def devise_mailer
    AgromotivaMailer
  end

  private

  def valid_seller?
    return false unless email_changed?
    Seller.with_role(:seller).select(:id).find_by(email: email).present?
  end
end