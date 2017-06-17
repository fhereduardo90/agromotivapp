module ServiceConcern
  extend ActiveSupport::Concern

  included do
    def self.call(*args)
      new(*args).call
    end
  end
end

class SuccessService
  include Virtus.model(strict: true)

  attribute :response, Object, writer: :private

  def initialize(response)
    self.response = response
  end

  def succeed?
    true
  end
end

class ErrorService
  include Virtus.model(strict: true)

  attribute :response, Object, writer: :private
  attribute :title, String, writer: :private
  attribute :message, String, writer: :private
  attribute :errors, Array, writer: :private
  attribute :code, Integer, writer: :private

  def initialize(
    options = { response: Object, title: '', message: '', errors: [], code: 0 }
  )
    self.response = options[:response]
    self.title = options[:title]
    self.message = options[:message]
    self.errors = parse_error(options[:errors])
    self.code = options[:code]
  end

  def succeed?
    false
  end

  private

  def parse_error(err)
    return err unless err.instance_of? ActiveModel::Errors
    err.messages.map { |k, v| { fieldname: k, messages: v } }
  end
end

class BaseService
  include ServiceConcern
  include Virtus.model(strict: true)

  attribute :params, Hash, writer: :private

  def initialize(params)
    self.params = params
  end

  def call
    raise NoImplementedError
  end

  protected

  def success(response = Object)
    SuccessService.new(response)
  end

  def error(options = {
    response: response, title: title, message: message, errors: []
  })
    ErrorService.new(
      response: options[:response],
      title: options[:title],
      message: options[:message],
      errors: options[:errors],
      code: options[:code]
    )
  end
end
