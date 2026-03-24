FROM node:24-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends git curl ca-certificates docker.io age \
  && curl -L -o /usr/local/bin/sops https://github.com/mozilla/sops/releases/latest/download/sops_linux_arm64 \
  && chmod +x /usr/local/bin/sops \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable

USER node
WORKDIR /workspace
