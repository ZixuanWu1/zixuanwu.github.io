#!/usr/bin/env bash
set -euo pipefail

# Prefer the isolated runtime prepared for this checkout, when available.
site_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$site_root"
site_ruby="$site_root/local/runtime/portable-ruby/3.1.4/bin/ruby"
site_bundle="$site_root/local/runtime/portable-ruby/3.1.4/bin/bundle"

if [[ -x "$site_ruby" && -f "$site_bundle" ]]; then
  export GEM_HOME="$site_root/local/ruby31-gems"
  export GEM_PATH="$site_root/local/ruby31-gems"
  export GEM_SPEC_CACHE="$site_root/local/gem-cache"
  export BUNDLE_APP_CONFIG="$site_root/local/bundle-config"
  export BUNDLE_PATH="$site_root/local/bundle"
  exec "$site_ruby" "$site_bundle" exec jekyll serve --host 127.0.0.1 --baseurl '' "$@"
fi

exec bundle exec jekyll serve --host 127.0.0.1 --baseurl '' "$@"
