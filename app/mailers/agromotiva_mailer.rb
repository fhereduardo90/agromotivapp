class AgromotivaMailer < Devise::Mailer
  include Devise::Controllers::UrlHelpers
  default from: 'Agromotiva <hello@agromotiva.org>'
  default template_path: 'mailers'

  def reset_password_instructions(record, token, opts = {})
    super(
      record,
      token,
      opts.merge(
        template_path: 'mailers',
        template_name: 'reset_password_instructions'
      )
    )
  end
end