#!/usr/bin/env bash
set -euo pipefail

if ! command -v mkcert >/dev/null 2>&1; then
  echo "mkcert no está instalado."
  echo "Instálalo con: brew install mkcert && mkcert -install"
  exit 1
fi

mkdir -p .certs
IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo 127.0.0.1)"

mkcert -install
mkcert \
  -cert-file .certs/cert.pem \
  -key-file .certs/key.pem \
  localhost 127.0.0.1 "$IP" suma.local

echo ""
echo "Certificado creado para localhost, 127.0.0.1, $IP y suma.local."
echo "Autoridad local: $(mkcert -CAROOT)"
echo "Para que el móvil confíe en él, instala $(mkcert -CAROOT)/rootCA.pem (ver docs/LOCAL_TESTING.md)."
