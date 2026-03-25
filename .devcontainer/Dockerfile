FROM node:24-bookworm

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    docker.io \
    age \
    libnspr4 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libdbus-1-3 \
    libcups2 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
  && curl -L -o /usr/local/bin/sops https://github.com/mozilla/sops/releases/latest/download/sops_linux_arm64 \
  && chmod +x /usr/local/bin/sops \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable

USER node
WORKDIR /workspace
