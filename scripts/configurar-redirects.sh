#!/usr/bin/env bash
# Aplica o redirect 308 dos hosts alternativos para o dominio final, via API da Vercel.
# Uso: bash scripts/configurar-redirects.sh
# Le o token de ~/.local/share/com.vercel.cli/auth.json (ou defina VERCEL_TOKEN).
set -euo pipefail

cd "$(dirname "$0")/.."
PROJETO="calculadoras-financeiras"
DOMINIO_FINAL="$(python3 -c "import json;print(json.load(open('site.config.json'))['url'].split('://')[1].rstrip('/'))")"
URL_ANTERIOR="$(python3 -c "import json;print(json.load(open('site.config.json')).get('urlAnterior',''))")"
HOST_ANTERIOR="${URL_ANTERIOR#*://}"; HOST_ANTERIOR="${HOST_ANTERIOR%%/*}"

TOKEN="${VERCEL_TOKEN:-}"
if [ -z "$TOKEN" ] && [ -f "$HOME/.local/share/com.vercel.cli/auth.json" ]; then
  TOKEN="$(python3 -c "import json,os;print(json.load(open(os.path.expanduser('~/.local/share/com.vercel.cli/auth.json'))).get('token',''))")"
fi
if [ -z "$TOKEN" ]; then
  echo "Token da Vercel nao encontrado. Defina VERCEL_TOKEN ou faca login com 'vercel login'." >&2
  exit 1
fi

aplicar() {
  local host="$1" destino="$2" resp saida
  resp="$(curl -s -X PATCH \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"redirect\":\"$destino\",\"redirectStatusCode\":308}" \
    "https://api.vercel.com/v9/projects/$PROJETO/domains/$host")"
  saida="$(printf '%s' "$resp" | python3 -c "import json,sys;d=json.load(sys.stdin);print('redirect=' + str(d.get('redirect')) + ' status=' + str(d.get('redirectStatusCode')) + (' erro=' + str(d.get('error')) if d.get('error') else ''))" 2>/dev/null || echo "resposta invalida")"
  printf "  %-42s %s\n" "$host" "$saida"
}

echo "Redirects 308 para $DOMINIO_FINAL:"
aplicar "www.$DOMINIO_FINAL" "$DOMINIO_FINAL"
if [ -n "$HOST_ANTERIOR" ] && [ "$HOST_ANTERIOR" != "www.$DOMINIO_FINAL" ]; then
  aplicar "$HOST_ANTERIOR" "$DOMINIO_FINAL"
fi

echo
echo "Conferindo:"
for host in "www.$DOMINIO_FINAL" "$HOST_ANTERIOR"; do
  [ -z "$host" ] && continue
  printf "  %-42s %s\n" "$host" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' --max-time 15 "https://$host/" 2>/dev/null || echo sem-resposta)"
done