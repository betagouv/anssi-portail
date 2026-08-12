{
  pkgs ? import sources.nixpkgs { },
  sources ? import ./npins,
}:
let
  nodeVersion = pkgs.lib.strings.trim (builtins.readFile ./.nvmrc);
  nodejs =
    pkgs."nodejs_${nodeVersion}" or (throw "Unsupported Node.js version in .nvmrc: ${nodeVersion}");
  nodejs-slim =
    pkgs."nodejs-slim_${nodeVersion}"
      or (throw "Unsupported Node.js version in .nvmrc: ${nodeVersion}");
  corepack = pkgs.corepack.override { inherit nodejs-slim; };
  bundler = pkgs.bundler.override { ruby = pkgs.ruby_4_0; };
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
      ruby_4_0
      bundler
      bash-language-server
      marksman
      nixd
      ruby-lsp
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
      export GEM_HOME="$PWD/.gems"
      export COREPACK_HOME="$PWD/.corepack"
      export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
      export UV_CACHE_DIR="$PWD/.uv-cache"
      export UV_TOOL_DIR="$PWD/.uv-tools"
      export UV_PYTHON_INSTALL_DIR="$PWD/.uv-python"
      export PATH="$PWD/.nix-bin:$GEM_HOME/bin:$PATH"

      mkdir -p "$PWD/.nix-bin" "$GEM_HOME" "$COREPACK_HOME" "$UV_CACHE_DIR" "$UV_TOOL_DIR" "$UV_PYTHON_INSTALL_DIR"

      # Corepack creates the pnpm shim in .nix-bin and installs the version
      # declared in package.json on first shell entry.
      corepack enable --install-directory "$PWD/.nix-bin" pnpm >/dev/null
      corepack install >/dev/null
    '';
  };
}
