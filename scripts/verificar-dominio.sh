#!/usr/bin/env bash
# Verifica a propagação do DNS de calcfinanceira.com.br e o estado na Vercel.
# Uso: bash scripts/verificar-dominio.sh
set -u
DOMINIO="calcfinanceira.com.br"
WWW="www.calcfinanceira.com.br"
IP1="216.198.79.1"
IP2="64.29.17.1"
CNAME="d05e5d306a365e27.vercel-dns-017.com"

echo "=== 1. Registros DNS autoritativos (a.auto.dns.br) ==="
printf "  A  %-28s -> %s\n" "$DOMINIO" "$(dig +short A $DOMINIO @a.auto.dns.br | tr '\n' ' ')"
printf "  A  %-28s -> %s\n" "www.$DOMINIO" "$(dig +short A $WWW @a.auto.dns.br | tr '\n' ' ')"
printf "  CN %-28s -> %s\n" "www.$DOMINIO" "$(dig +short CNAME $WWW @a.auto.dns.br | tr '\n' ' ')"

echo
echo "=== 2. Resolucao publica (Google 8.8.8.8) ==="
printf "  A  %-28s -> %s\n" "$DOMINIO" "$(dig +short A $DOMINIO @8.8.8.8 | tr '\n' ' ')"
printf "  A  %-28s -> %s\n" "www.$DOMINIO" "$(dig +short A $WWW @8.8.8.8 | tr '\n' ' ')"

echo
echo "=== 3. HTTPS (o que o visitante vera) ==="
for h in "$DOMINIO" "www.$DOMINIO"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "https://$h/" 2>/dev/null)
  printf "  %-28s HTTP %s\n" "$h" "${code:-sem-resposta}"
done

echo
echo "=== 4. Redirecionamentos (devem responder 308 para o dominio final) ==="
for h in "www.$DOMINIO" "calculadoras-financeiras-two.vercel.app"; do
  out=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" --max-time 15 "https://$h/" 2>/dev/null)
  printf "  %-28s %s\n" "$h" "${out:-sem-resposta}"
done

echo
echo "=== 5. Verificacao na Vercel ==="
cd "$(dirname "$0")/.." 2>/dev/null || cd .
vercel domains verify "$DOMINIO" 2>&1 | grep -E "DNS Configuration|Project" | sed 's/^/  /'

echo
echo "=== 6. O esperado ==="
echo "  A  @    -> $IP1"
echo "  A  @    -> $IP2"
echo "  CN www  -> $CNAME"
echo
echo "  Observacao: acessar https://$IP1/ direto mostra a tela da Vercel."
echo "  Isso e esperado: o IP sem Host/SNI valido devolve 308 -> vercel.com."
echo "  O que importa e o dominio responder 200 com o conteudo do site."
