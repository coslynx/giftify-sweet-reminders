#!/bin/bash

# Ensure the script exits immediately if a command exits with a non-zero status.
# Ensure the script exits on undefined variables.
# Ensure the script exits on pipe failures.
set -euo pipefail

# --- Logging Functions ---
# Logs an informational message to stdout with a timestamp.
# Usage: log_info "Starting setup..."
log_info() {
  echo "[INFO] $(date +'%Y-%m-%d %H:%M:%S') - $1"
}

# Logs an error message to stderr with a timestamp.
# Usage: log_error "Node.js not found."
log_error() {
  echo "[ERROR] $(date +'%Y-%m-%d %H:%M:%S') - $1" >&2
}

# --- Prerequisite Check Function ---
# Verifies that Node.js and npm are installed and available in the PATH.
check_prereqs() {
  log_info "Checking prerequisites..."
  if ! command -v node >/dev/null 2>&1; then
    log_error "Node.js is not installed or not found in PATH. Please install Node.js (version 18 or higher recommended)."
    exit 1
  fi
  if ! command -v npm >/dev/null 2>&1; then
    log_error "npm is not installed or not found in PATH. Please install npm (usually included with Node.js)."
    exit 1
  fi
  log_info "Node.js and npm found."
}

# --- Configuration Check Function ---
# Checks for the .env file and attempts to create it from .env.example if missing.
check_config() {
  log_info "Checking configuration..."
  if [ -f ".env" ]; then
    log_info "'.env' configuration file found."
  else
    log_info "'.env' file not found."
    if [ -f ".env.example" ]; then
      log_info "Found '.env.example'. Copying to '.env'..."
      cp .env.example .env
      # Using printf for potentially multi-line messages
      printf "[WARN] $(date +'%Y-%m-%d %H:%M:%S') - '.env' file was missing. Copied '.env.example' to '.env'.\n" >&2
      printf "[IMPORTANT] $(date +'%Y-%m-%d %H:%M:%S') - Please update the '.env' file with your actual Firebase project configuration values before proceeding or if the application fails to connect.\n" >&2
    else
      log_error "'.env' file is missing and no '.env.example' template was found. Please create a '.env' file with your Firebase configuration."
      exit 1
    fi
  fi
}

# --- Dependency Installation Function ---
# Checks for the node_modules directory and runs npm install if it's missing.
install_deps() {
  log_info "Checking dependencies..."
  if [ -d "node_modules" ]; then
    log_info "'node_modules' directory found. Skipping dependency installation."
  else
    log_info "'node_modules' directory not found. Installing dependencies..."
    # Run npm install. Output will be shown. set -e handles failures.
    npm install
    log_info "Dependencies installed successfully."
  fi
}

# --- Main Execution ---
main() {
  log_info "--- Sweet Surprise Reminders Development Startup ---"
  check_prereqs
  check_config
  install_deps

  log_info "Starting the Vite development server..."
  # Execute the dev script from package.json
  npm run dev
  log_info "--- Startup script finished (Handed over to Vite) ---"
}

# Execute the main function
main

# Script ends here; control is passed to 'npm run dev'