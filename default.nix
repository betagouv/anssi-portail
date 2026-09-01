{
  pkgs ? import sources.nixpkgs { },
  sources ? import ./npins,
}:
let
  # Utilise .nvmrc comme source de vérité pour la version majeure de Node.js.
  nodeVersion = pkgs.lib.strings.trim (builtins.readFile ./.nvmrc);
  nodejs =
    pkgs."nodejs_${nodeVersion}" or (throw "Unsupported Node.js version in .nvmrc: ${nodeVersion}");
  nodejs-slim =
    pkgs."nodejs-slim_${nodeVersion}"
      or (throw "Unsupported Node.js version in .nvmrc: ${nodeVersion}");
  corepack = pkgs.corepack.override { inherit nodejs-slim; };

  # Utilise .ruby-version comme source de vérité pour la version majeure et mineure de Ruby.
  rubyVersion = pkgs.lib.strings.trim (builtins.readFile ./.ruby-version);
  rubyAttribute = "ruby_${
    builtins.replaceStrings [ "." ] [ "_" ] (pkgs.lib.versions.majorMinor rubyVersion)
  }";
  ruby =
    let
      package =
        pkgs.${rubyAttribute} or (throw "Unsupported Ruby version in .ruby-version: ${rubyVersion}");
    in
    if toString package.version == rubyVersion then
      package
    else
      throw "Ruby version ${rubyVersion} in .ruby-version resolves to ${package.version} in nixpkgs";
  bundler = pkgs.bundler.override { inherit ruby; };
  rubyLspSerena = pkgs.writeShellScriptBin "ruby-lsp" ''
    export BUNDLE_GEMFILE=/dev/null
    exec ${ruby.gems.ruby-lsp}/bin/ruby-lsp "$@"
  '';

  playwrightCli = pkgs.buildNpmPackage {
    pname = "playwright-cli";
    inherit ((builtins.fromJSON (builtins.readFile (sources."playwright-cli" + "/package.json"))))
      version
      ;
    src = sources."playwright-cli";
    npmDepsHash = "sha256-3kqiQvGtZfsmLHVWeCSM1yOYb+ws2x1vMPC1OuvrKAI=";
    dontNpmBuild = true;
  };
in
{
  shell = pkgs.mkShell {
    packages = with pkgs; [
      nodejs
      corepack
      uv
      ruby
      rubyLspSerena
      bundler
      bash-language-server
      marksman
      nixd
      svelte-language-server
      taplo
      vscode-langservers-extracted
      yaml-language-server
      docker-compose
      playwrightCli
      prek
      npins
    ];

    shellHook = ''
      # Keep project-local Ruby and Corepack state out of $HOME.
      # Native gems are Ruby-ABI-specific; never share them across Ruby versions.
      export GEM_HOME="$PWD/.gems/${rubyVersion}"
      export COREPACK_HOME="$PWD/.corepack"
      export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
      export UV_CACHE_DIR="$PWD/.uv-cache"
      export UV_TOOL_DIR="$PWD/.uv-tools"
      export UV_PYTHON_INSTALL_DIR="$PWD/.uv-python"
      export PATH="$PWD/.nix-bin:${rubyLspSerena}/bin:$GEM_HOME/bin:$PATH"

      mkdir -p "$PWD/.nix-bin" "$GEM_HOME" "$COREPACK_HOME" "$UV_CACHE_DIR" "$UV_TOOL_DIR" "$UV_PYTHON_INSTALL_DIR"

      # Corepack creates the pnpm shim in .nix-bin and installs the version
      # declared in package.json on first shell entry.
      corepack enable --install-directory "$PWD/.nix-bin" pnpm >/dev/null
      corepack install >/dev/null
    '';
  };
}
