require 'json'

Jekyll::Hooks.register :site, :after_init do |site|
  root = File.expand_path('..', site.source)
  package_json = File.join(root, 'package.json')

  unless File.exist?(package_json)
    Jekyll.logger.warn "package_json:", "package.json introuvable au niveau parent"
    next
  end

  package = JSON.parse(File.read(package_json))
  deps = package['runtimeDependencies'] || {}

  site.config['version_lab_ui_kit'] = deps['@lab-anssi/ui-kit']
end
