Grape::DSL::Settings.module_eval do
  # Fetch our top-level settings, which apply to all endpoints in the API.
  def top_level_setting
    @top_level_setting ||= build_top_level_setting
  end

  private
  # Builds the current class :inheritable_setting. If available, it returns the superclass's :inheritable_setting.
  # Otherwise, a clean :inheritable_setting is returned.
  def build_top_level_setting
    if defined?(superclass) && superclass.respond_to?(:inheritable_setting) && superclass != Grape::API
      superclass.inheritable_setting
    else
      Grape::Util::InheritableSetting.new
    end
  end
end