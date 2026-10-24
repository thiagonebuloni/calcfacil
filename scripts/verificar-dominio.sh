#!/usr/bin/env bash
# Verifica a propagação do DNS de calcfinanceira.com.br e o estado na Vercel.
# Uso: bash scripts/verificar-dominio.sh [token-do-search-console]
set -u
DOMINIO="calcfinanceira.com.br"
WWW="www.calcfinanceira.com.br"
IP1="216.198.79.1"
IP2="64.29.17.1"
CNAME="d05e5d306a365e27.vercel-dns-017.com"
TOKEN="${1:-}"

# Os NS autoritativos sao discovery via delegacao, nao fixos: o Registro.br
# responde a zona do dominio nos servidores `sec.dns.br` (delegados), enquanto
# o par `auto.dns.br` so devolve o SPF generico do Registro.br.
NS=$(dig +short NS "$DOMINIO" @1.1.1.1 | head -2)
if [ -z "$NS" ]; then
  echo "Nao foi possivel resolver os NS de $DOMINIO." >&2
  exit 1
fi

echo "=== 1. Registros DNS autoritativos ($(echo "$NS" | tr '\n' ' ')) ==="
for ns in $NS; do
  printf "  A  %-28s -> %s\n" "$DOMINIO" "$(dig +short A $DOMINIO @$ns | tr '\n' ' ')"
  printf "  CN %-28s -> %s\n" "www.$DOMINIO" "$(dig +short CNAME $WWW @$ns | tr '\n' ' ')"
done

echo
echo "=== 2. Resolucao publica (Google 8.8.8.8) ==="
printf "  A  %-28s -> %s\n" "$DOMINIO" "$(dig +short A $DOMINIO @8.8.8.8 | tr '\n' ' ')"
printf "  A  %-28s -> %s\n" "www.$DOMINIO" "$(dig +short A $WWW @8.8.8.8 | tr '\n' ' ')"

echo
echo "=== 3. TXT (verificacao do Search Console) ==="
TXT=$(dig +short TXT "$DOMINIO" @1.1.1.1)
if [ -z "$TXT" ]; then
  echo "  (nenhum registro TXT encontrado)"
else
  echo "$TXT" | sed 's/^/  /'
fi
if [ -n "$TOKEN" ]; then
  if echo "$TXT" | grep -qF "$TOKEN"; then
    echo "  OK: token encontrado e propagado."
  else
    echo "  NAO ENCONTRADO: token ausente ou ainda propagando."
    echo "  A propagacao pode levar de algumas horas a 1-2 dias."
  fi
else
  echo "  (informe o token como argumento para checar)"
  echo "  Ex.: bash scripts/verificar-dominio.sh google-site-verification=abc123"
fi

echo
echo "=== 4. HTTPS (o que o visitante vera) ==="
for h in "$DOMINIO" "www.$DOMINIO"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "https://$h/" 2>/dev/null)
  printf "  %-28s HTTP %s\n" "$h" "${code:-sem-resposta}"
done

echo
echo "=== 5. Redirecionamentos (devem responder 308 para o dominio final) ==="
for h in www."$DOMINIO" "calculadoras-financeiras-two.vercel.app"; do
  out=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" --max-time 15 "https://$h/" 2>/dev/null)
  printf "  %-28s %s\n" "$h" "${out:-sem-resposta}"
done

echo
echo "=== 6. Verificacao na Vercel ==="
cd "$(dirname "$0")/.." 2>/dev/null || cd .
vercel domains verify "$DOMINIO" 2>&1 | grep -E "DNS Configuration|Project" | sed 's/^/  /'

echo
echo "=== 7. O esperado ==="
echo "  A  @    -> $IP1"
echo "  A  @    -> $IP2"
echo "  CN www  -> $CNAME"
echo
echo "  Observacao: acessar https://$IP1/ direto mostra a tela da Vercel."
echo "  Isso e esperado: o IP sem Host/SNI valido devolve 308 -> vercel.com."
echo "  O que importa e o dominio responder 200 com o conteudo do site."
