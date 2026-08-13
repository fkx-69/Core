#!/usr/bin/env bash

set -Eeuo pipefail

umask 027

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
readonly DEPLOY_ROOT="/opt/core"
readonly RELEASES_DIR="$DEPLOY_ROOT/releases"
readonly CURRENT_LINK="$DEPLOY_ROOT/current"
readonly SERVICE_NAME="core.service"
readonly SERVICE_USER="core"
readonly SERVICE_GROUP="core"
readonly ENV_FILE="/etc/core/core.env"
readonly PUBLIC_URL="https://mycore.work/"
readonly LOCAL_URL="http://172.30.0.1:3000/"
readonly RELEASE_RETENTION=5
readonly LOCK_FILE="${TMPDIR:-/tmp}/core-production-deploy.lock"

RELEASE_DIR=""
PREVIOUS_RELEASE=""
SMOKE_UNIT=""
SWITCHED=false

log() {
  printf '\n[%s] %s\n' "$(date -u +%H:%M:%S)" "$*"
}

fail() {
  printf '\nErreur : %s\n' "$*" >&2
  exit 1
}

is_safe_release_path() {
  [[ "$1" =~ ^/opt/core/releases/[0-9]{8}T[0-9]{6}Z$ ]]
}

stop_smoke_unit() {
  if [[ -n "$SMOKE_UNIT" ]]; then
    sudo -n systemctl stop "$SMOKE_UNIT" >/dev/null 2>&1 || true
    SMOKE_UNIT=""
  fi
}

rollback() {
  if ! is_safe_release_path "$PREVIOUS_RELEASE" || [[ ! -d "$PREVIOUS_RELEASE" ]]; then
    printf 'Rollback impossible : ancienne release invalide (%s).\n' "$PREVIOUS_RELEASE" >&2
    return 1
  fi

  log "Échec détecté : retour automatique vers $(basename "$PREVIOUS_RELEASE")"
  sudo -n ln -sfn "$PREVIOUS_RELEASE" "$DEPLOY_ROOT/current.rollback"
  sudo -n mv -Tf "$DEPLOY_ROOT/current.rollback" "$CURRENT_LINK"
  sudo -n systemctl restart "$SERVICE_NAME"
  sudo -n systemctl is-active --quiet "$SERVICE_NAME"
}

cleanup() {
  local exit_code=$?
  local active_release=""

  trap - EXIT INT TERM
  set +e
  stop_smoke_unit

  if (( exit_code != 0 )); then
    if [[ "$SWITCHED" == true ]]; then
      rollback || true
    fi

    if [[ -n "$RELEASE_DIR" ]] && is_safe_release_path "$RELEASE_DIR" && [[ -d "$RELEASE_DIR" ]]; then
      active_release="$(sudo -n readlink -f "$CURRENT_LINK" 2>/dev/null || true)"
      if [[ "$active_release" != "$RELEASE_DIR" ]]; then
        sudo -n rm -rf --one-file-system -- "$RELEASE_DIR"
      fi
    fi
  fi

  exit "$exit_code"
}

run_in_release() {
  local unit_name=$1
  local load_production_env=$2
  local -a environment_property=()
  shift 2

  if [[ "$load_production_env" == true ]]; then
    environment_property+=(--property="EnvironmentFile=$ENV_FILE")
  fi

  sudo -n systemd-run \
    --wait \
    --pipe \
    --collect \
    --unit="$unit_name" \
    --property="User=$SERVICE_USER" \
    --property="Group=$SERVICE_GROUP" \
    --property="WorkingDirectory=$RELEASE_DIR" \
    "${environment_property[@]}" \
    --setenv=NODE_ENV=production \
    --setenv=HOME=/var/lib/core \
    --setenv=PATH=/usr/bin:/bin \
    "$@"
}

wait_for_url() {
  local url=$1
  local attempts=${2:-30}
  local attempt

  for ((attempt = 1; attempt <= attempts; attempt += 1)); do
    if curl \
      --fail \
      --silent \
      --show-error \
      --location \
      --max-redirs 3 \
      --max-time 5 \
      "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done

  return 1
}

find_smoke_port() {
  local port

  for ((port = 3101; port <= 3199; port += 1)); do
    if ! ss -H -ltn | awk '{ print $4 }' | grep -Eq "(^|:)${port}$"; then
      printf '%s\n' "$port"
      return 0
    fi
  done

  return 1
}

prune_old_releases() {
  local active_release
  local index
  local candidate
  local -a releases=()

  active_release="$(sudo -n readlink -f "$CURRENT_LINK")"
  mapfile -t releases < <(
    sudo -n find "$RELEASES_DIR" \
      -mindepth 1 \
      -maxdepth 1 \
      -type d \
      -regextype posix-extended \
      -regex '.*/[0-9]{8}T[0-9]{6}Z' \
      -printf '%p\n' | sort -r
  )

  for ((index = RELEASE_RETENTION; index < ${#releases[@]}; index += 1)); do
    candidate="${releases[$index]}"
    if is_safe_release_path "$candidate" && [[ "$candidate" != "$active_release" ]]; then
      sudo -n rm -rf --one-file-system -- "$candidate"
    fi
  done
}

trap cleanup EXIT
trap 'exit 130' INT TERM

for required_command in curl flock npm rsync ss sudo systemd-run; do
  command -v "$required_command" >/dev/null 2>&1 || fail "commande requise absente : $required_command"
done

sudo -n true >/dev/null 2>&1 || fail "sudo non interactif est requis pour déployer."
sudo -n test -r "$ENV_FILE" || fail "environnement de production introuvable : $ENV_FILE"
sudo -n test -d "$RELEASES_DIR" || fail "dossier de releases introuvable : $RELEASES_DIR"
sudo -n systemctl is-active --quiet "$SERVICE_NAME" || fail "$SERVICE_NAME n'est pas actif."
id "$SERVICE_USER" >/dev/null 2>&1 || fail "utilisateur système introuvable : $SERVICE_USER"

exec 9>"$LOCK_FILE"
flock -n 9 || fail "un autre déploiement est déjà en cours."

PREVIOUS_RELEASE="$(sudo -n readlink -f "$CURRENT_LINK")"
is_safe_release_path "$PREVIOUS_RELEASE" || fail "la release active est invalide : $PREVIOUS_RELEASE"

log "Vérifications du projet"
if [[ -n "$(git -C "$PROJECT_ROOT" status --porcelain 2>/dev/null || true)" ]]; then
  printf 'Note : l’état actuel du dossier de travail, y compris les changements non commités, sera déployé.\n'
fi

(
  cd "$PROJECT_ROOT"
  npm test
  npm run lint
)

readonly RELEASE_ID="$(date -u +%Y%m%dT%H%M%SZ)"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_ID"
is_safe_release_path "$RELEASE_DIR" || fail "identifiant de release invalide : $RELEASE_ID"
[[ ! -e "$RELEASE_DIR" ]] || fail "la release existe déjà : $RELEASE_DIR"

log "Création de la release $RELEASE_ID"
sudo -n install -d -m 0750 -o "$SERVICE_USER" -g "$SERVICE_GROUP" "$RELEASE_DIR"
sudo -n rsync \
  --archive \
  --chown="$SERVICE_USER:$SERVICE_GROUP" \
  --include='/.env.example' \
  --exclude='/.env*' \
  --exclude='/.git/' \
  --exclude='/.next/' \
  --exclude='/node_modules/' \
  --exclude='/.data/' \
  --exclude='/coverage/' \
  --exclude='/tmp/' \
  --exclude='/tsconfig.tsbuildinfo' \
  --exclude='/.core-deploy.lock' \
  "$PROJECT_ROOT/" "$RELEASE_DIR/"

log "Installation reproductible des dépendances"
run_in_release "core-install-$RELEASE_ID" false \
  /usr/bin/npm ci --include=dev --no-audit --no-fund

log "Build Next.js avec l’environnement de production"
run_in_release "core-build-$RELEASE_ID" true /usr/bin/npm run build
[[ -s "$RELEASE_DIR/.next/BUILD_ID" ]] || fail "le build n'a pas produit de BUILD_ID."

SMOKE_PORT="$(find_smoke_port)" || fail "aucun port local n'est disponible pour le test HTTP."
readonly SMOKE_PORT
SMOKE_UNIT="core-smoke-$RELEASE_ID.service"

log "Test HTTP de la nouvelle release sur le port $SMOKE_PORT"
sudo -n systemd-run \
  --quiet \
  --collect \
  --unit="$SMOKE_UNIT" \
  --property="User=$SERVICE_USER" \
  --property="Group=$SERVICE_GROUP" \
  --property="WorkingDirectory=$RELEASE_DIR" \
  --property="EnvironmentFile=$ENV_FILE" \
  --setenv=NODE_ENV=production \
  --setenv=HOME=/var/lib/core \
  --setenv=PATH=/usr/bin:/bin \
  /usr/bin/npm run start -- --hostname 127.0.0.1 --port "$SMOKE_PORT"

if ! wait_for_url "http://127.0.0.1:$SMOKE_PORT/" 30; then
  sudo -n journalctl -u "$SMOKE_UNIT" -n 80 --no-pager >&2 || true
  fail "la nouvelle release ne répond pas correctement avant la bascule."
fi
stop_smoke_unit

log "Bascule atomique et redémarrage de $SERVICE_NAME"
sudo -n ln -sfn "$RELEASE_DIR" "$DEPLOY_ROOT/current.next"
sudo -n mv -Tf "$DEPLOY_ROOT/current.next" "$CURRENT_LINK"
SWITCHED=true
sudo -n systemctl restart "$SERVICE_NAME"

wait_for_url "$LOCAL_URL" 30 || fail "le service local ne répond pas après la bascule."
sudo -n systemctl is-active --quiet "$SERVICE_NAME" || fail "$SERVICE_NAME n'est pas actif après la bascule."

MAIN_PID="$(sudo -n systemctl show --property=MainPID --value "$SERVICE_NAME")"
readonly MAIN_PID
[[ "$MAIN_PID" =~ ^[1-9][0-9]*$ ]] || fail "PID principal invalide pour $SERVICE_NAME."
RUNNING_DIR="$(sudo -n readlink -f "/proc/$MAIN_PID/cwd")"
readonly RUNNING_DIR
[[ "$RUNNING_DIR" == "$RELEASE_DIR" ]] || fail "le service ne tourne pas depuis la nouvelle release."

wait_for_url "$PUBLIC_URL" 20 || fail "$PUBLIC_URL ne répond pas après la mise en ligne."
SWITCHED=false

log "Nettoyage des anciennes releases (conservation : $RELEASE_RETENTION)"
if ! prune_old_releases; then
  printf 'Avertissement : la purge des anciennes releases a échoué ; la version en ligne reste active.\n' >&2
fi

log "Déploiement réussi : $RELEASE_ID"
printf 'Site public : %s\n' "$PUBLIC_URL"
