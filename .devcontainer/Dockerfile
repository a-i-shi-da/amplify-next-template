FROM node:22

WORKDIR /workspace

USER root

RUN npx -y playwright install --with-deps

RUN mkdir -p /home/node/.cache/ms-playwright \
    && chown -R node:node /home/node

USER node

RUN npx -y playwright install