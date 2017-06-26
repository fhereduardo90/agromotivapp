class Seller < Person
  has_many :assets, -> { where attachable_type: 'Seller' },
           foreign_type: :attachable_type, foreign_key: :attachable_id
  has_one :asset, -> { where attachable_type: 'Seller', deleted: false },
          foreign_type: :attachable_type, foreign_key: :attachable_id

  validates :email, uniqueness: true, if: :valid_seller?

  protected

  def assign_default_role
    add_role(:seller) if roles.blank?
  end

  private

  def valid_seller?
    return false unless email_changed?
    Seller.with_role(:seller).select(:id).find_by(email: email).present?
  end
end