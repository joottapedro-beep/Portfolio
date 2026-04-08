#!/bin/zsh

cd "$(dirname "$0")" || exit 1

PORT=8000
HOST="0.0.0.0"

get_local_ip() {
  local ip

  ip=$(ipconfig getifaddr en0 2>/dev/null) && [ -n "$ip" ] && echo "$ip" && return
  ip=$(ipconfig getifaddr en1 2>/dev/null) && [ -n "$ip" ] && echo "$ip" && return
  ip=$(ifconfig | awk '/inet / && $2 != "127.0.0.1" { print $2; exit }') && [ -n "$ip" ] && echo "$ip" && return

  echo "localhost"
}

while lsof -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

LOCAL_URL="http://localhost:${PORT}"
NETWORK_IP="$(get_local_ip)"
NETWORK_URL="http://${NETWORK_IP}:${PORT}"

clear
echo "Portfolio local"
echo
echo "Pasta: $(pwd)"
echo "No computador: ${LOCAL_URL}"
echo "No telemovel:  ${NETWORK_URL}"
echo
echo "Liga o telemovel a mesma rede Wi-Fi e abre o URL acima."
echo "A abrir o site no browser deste computador..."
echo "Para parar o servidor, carrega em Ctrl + C nesta janela."
echo

sleep 1
open "${LOCAL_URL}"
python3 -m http.server "${PORT}" --bind "${HOST}"
