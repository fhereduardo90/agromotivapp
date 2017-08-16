class Asset < ApplicationRecord
  belongs_to :attachable, polymorphic: true

  UNIQUE_ATTACHABLE_CLASSES = %w(User Seller Category).freeze

  has_attached_file :image, path: ':class/:attachable_type/:attachable_id/:style/:id/:filename',
                    styles: { high: '1080x1080#', medium: '640x640#', thumbnail: '320x320#' }
  validates_attachment :image,
                       content_type: { content_type: ['image/jpeg', 'image/png'] },
                       size: { in: 0..3.megabytes },
                       presence: true

  process_in_background :image, only_process: [:high, :medium, :thumbnail]

  validates :attachable_id, uniqueness: {
    scope: :attachable_type,
    conditions: proc { where('attachable_type IN (?) AND deleted = ?', UNIQUE_ATTACHABLE_CLASSES, false) }
  }, unless: proc { |a| a.deleted == true }

  Paperclip.interpolates :attachable_type do |attachment, style|
    attachment.instance.attachable_type.to_s.downcase
  end

  Paperclip.interpolates :attachable_id do |attachment, style|
    attachment.instance.attachable_id
  end
end
