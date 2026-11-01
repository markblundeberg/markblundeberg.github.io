#!/bin/sh
# Build a static snapshot of the site from the current checkout and serve it to the LAN, so a phone can
# look before anything is pushed. Read-only (python's http.server over a copy of the build). Ctrl-C stops it.
#
#   bin/preview.sh            # build, then serve on port 8766
#   PORT=8800 bin/preview.sh  # another port (only 8766 is forwarded to the family network)
#
# From the family Wi-Fi (phones), the router forwards 192.168.1.10:8766 to this machine (polariton);
# see ~/git/netsec/desk/router-apply.sh. Without that forward, only the desk network can reach it.
set -eu
PORT="${PORT:-8766}"
cd "$(dirname "$0")/.."
OUT="$(mktemp -d "${TMPDIR:-/tmp}/site-preview.XXXXXX")"
trap 'rm -rf "$OUT"' EXIT INT TERM
echo "Building $(git rev-parse --abbrev-ref HEAD) @ $(git rev-parse --short HEAD) into $OUT ..."
npx @11ty/eleventy --output="$OUT" --quiet
DESK_IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
echo
echo "Serving the snapshot (Ctrl-C to stop):"
echo "  this machine:  http://127.0.0.1:$PORT/"
[ -n "$DESK_IP" ] && echo "  desk network:  http://$DESK_IP:$PORT/"
[ "$PORT" = 8766 ] && echo "  phone (family Wi-Fi):  http://192.168.1.10:8766/"
echo
python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$OUT"
