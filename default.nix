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
    version = "0.1.15";

    src = sources."playwright-cli";

    npmDepsHash = "sha256-ZrO8yIqMYMQUlsQraejVgKRZ7klC5/8UsV3/H1EqYtA=";
    dontNpmBuild = true;
  };
in
{
  shell = pkgs.mkShell {
    packages = with pkgs; [
      nodejs
      corepack
      ruby_4_0
      bundler
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
      export PATH="$PWD/.nix-bin:$GEM_HOME/bin:$PATH"

      mkdir -p "$PWD/.nix-bin" "$GEM_HOME" "$COREPACK_HOME"

      # package.json declares pnpm@10.24.0. Corepack creates the pnpm shim
      # in .nix-bin and downloads that exact version on first shell entry.
      corepack enable --install-directory "$PWD/.nix-bin" >/dev/null
      corepack prepare pnpm@10.24.0 --activate >/dev/null
    '';
  };
}
