class Asset < ApplicationRecord
  belongs_to :attachable, polymorphic: true

  has_attached_file :image, path: ':class/:attachable_type/:attachable_id/:style/:id/:filename'
  validates_attachment :image,
                       content_type: { content_type: ['image/jpeg', 'image/png'] },
                       size: { in: 0..3.megabytes },
                       presence: true

  validates :attachable_id, uniqueness: {
    conditions: proc { where('attachable_type = ? AND deleted = ?', User.to_s, false) }
  }, unless: proc { |a| a.deleted == true }

  Paperclip.interpolates :attachable_type do |attachment, style|
    attachment.instance.attachable_type.to_s.downcase
  end

  Paperclip.interpolates :attachable_id do |attachment, style|
    attachment.instance.attachable_id
  end
end
