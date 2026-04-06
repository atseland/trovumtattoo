#!/usr/bin/env bash
set -euo pipefail

LOG_ROOT="${DEVLOG_ROOT:-/Users/33selale/Documents/Dev_Prosjekter/DevLogs}"
SESSION_FILE=".devlog-session"

sanitize() {
  printf '%s' "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9._-]+/-/g; s/^-+//; s/-+$//'
}

detect_framework() {
  if grep -q '"next"' package.json 2>/dev/null; then
    echo "next"
  elif grep -q '"@sveltejs/kit"' package.json 2>/dev/null; then
    echo "svelte"
  else
    echo "unknown"
  fi
}

project_name() {
  basename "$PWD"
}

project_has_local_git() {
  local top
  top="$(git rev-parse --show-toplevel 2>/dev/null || true)"
  [ -n "$top" ] && [ "$top" = "$PWD" ]
}

branch_name() {
  if project_has_local_git; then
    git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "no-git"
  else
    echo "no-git"
  fi
}

active_log() {
  if [ ! -f "$SESSION_FILE" ]; then
    echo "FEIL: Ingen aktiv session. Kjor: just session-start \"<slug>\"" >&2
    exit 1
  fi

  local log_file
  log_file="$(cat "$SESSION_FILE")"
  if [ ! -f "$log_file" ]; then
    echo "FEIL: Aktiv sessionfil finnes ikke lenger: $log_file" >&2
    exit 1
  fi

  printf '%s\n' "$log_file"
}

append_under_heading() {
  local file="$1"
  local heading="$2"
  local entry="$3"
  local tmp
  tmp="$(mktemp)"

  awk -v heading="$heading" -v entry="$entry" '
    $0 == heading {
      print
      print entry
      next
    }
    { print }
  ' "$file" > "$tmp"

  mv "$tmp" "$file"
}

start_session() {
  local slug="${1:-work}"

  if [ -f "$SESSION_FILE" ] && [ -n "$(cat "$SESSION_FILE")" ] && [ -f "$(cat "$SESSION_FILE")" ]; then
    echo "Aktiv session finnes allerede: $(cat "$SESSION_FILE")"
    exit 0
  fi

  local project framework date ts dir file safe_project safe_slug
  project="$(project_name)"
  framework="$(detect_framework)"
  date="$(date +%Y-%m-%d)"
  ts="$(date +%H%M%S)"
  safe_project="$(sanitize "$project")"
  safe_slug="$(sanitize "$slug")"
  if [ -z "$safe_slug" ]; then
    safe_slug="work"
  fi

  dir="$LOG_ROOT/$framework/$safe_project/sessions/$date"
  file="$dir/${ts}-${safe_slug}.md"
  mkdir -p "$dir"

  cat > "$file" <<LOGEOF
# Session Logg

## Metadata

- Startet: $(date '+%Y-%m-%d %H:%M:%S')
- Prosjekt: $project
- Framework: $framework
- Repo: $PWD
- Branch: $(branch_name)
- Session slug: $slug

## Maal

## Implementeringer

## LLM-feil

## Brukerkommentarer

## Workflow-observasjoner

## Verifikasjon

## Git-state

## Oppsummering
LOGEOF

  printf '%s\n' "$file" > "$SESSION_FILE"
  echo "$file"
}

append_entry() {
  local category="${1:?mangler kategori}"
  shift
  local text="${*:-}"
  if [ -z "$text" ]; then
    echo "FEIL: Melding mangler." >&2
    exit 1
  fi

  local file heading timestamp
  file="$(active_log)"
  timestamp="$(date '+%H:%M:%S')"

  case "$category" in
    goal) heading="## Maal" ;;
    implementation) heading="## Implementeringer" ;;
    error) heading="## LLM-feil" ;;
    feedback) heading="## Brukerkommentarer" ;;
    flow) heading="## Workflow-observasjoner" ;;
    verify) heading="## Verifikasjon" ;;
    summary) heading="## Oppsummering" ;;
    *)
      echo "FEIL: Ukjent kategori: $category" >&2
      exit 1
      ;;
  esac

  append_under_heading "$file" "$heading" "- [$timestamp] $text"
  echo "$file"
}

close_session() {
  local summary="${*:-Session avsluttet.}"
  local file timestamp git_head git_status git_changes
  file="$(active_log)"
  timestamp="$(date '+%H:%M:%S')"

  if project_has_local_git; then
    git_head="$(git rev-parse --short HEAD 2>/dev/null || echo 'ingen-commit')"
    git_status="$(git status --short 2>/dev/null | tr '\n' '; ' | sed 's/; $//' )"
    git_changes="$(git diff --name-only 2>/dev/null | tr '\n' ', ' | sed 's/, $//' )"

    if [ -z "$git_status" ]; then
      git_status="clean"
    fi

    if [ -z "$git_changes" ]; then
      git_changes="ingen unstaged endringer"
    fi
  else
    git_head="no-git"
    git_status="no-git"
    git_changes="no-git"
  fi

  append_under_heading "$file" "## Git-state" "- [$timestamp] Endrede filer: $git_changes"
  append_under_heading "$file" "## Git-state" "- [$timestamp] Status: $git_status"
  append_under_heading "$file" "## Git-state" "- [$timestamp] HEAD: $git_head"
  append_under_heading "$file" "## Git-state" "- [$timestamp] Branch: $(branch_name)"
  append_under_heading "$file" "## Oppsummering" "- [$timestamp] $summary"
  rm -f "$SESSION_FILE"
  echo "$file"
}

show_session() {
  active_log
}

case "${1:-}" in
  start)
    shift
    start_session "$@"
    ;;
  append)
    shift
    append_entry "$@"
    ;;
  close)
    shift
    close_session "$@"
    ;;
  show)
    show_session
    ;;
  *)
    cat <<USAGE >&2
Bruk:
  scripts/devlog.sh start [slug]
  scripts/devlog.sh append <goal|implementation|error|feedback|flow|verify|summary> <tekst>
  scripts/devlog.sh close [oppsummering]
  scripts/devlog.sh show
USAGE
    exit 1
    ;;
esac
