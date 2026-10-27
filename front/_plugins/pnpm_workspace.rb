require 'yaml'

Jekyll::Hooks.register :site, :after_init do |site|
  root = File.expand_path('..', site.source)
  pnpm_workspace = File.join(root, 'pnpm-workspace.yaml')

  unless File.exist?(pnpm_workspace)
    Jekyll.logger.warn "pnpm_workspace:", "pnpm-workspace.yaml introuvable au niveau parent"
    next
  end

  workspace = YAML.safe_load_file(pnpm_workspace)
  catalog = workspace['catalog'] || {}

  site.config['version_lab_ui_kit'] = catalog['@lab-anssi/ui-kit']
end
