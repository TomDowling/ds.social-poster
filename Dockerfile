# Digital Space Social Poster: the official Postiz image with Digital Space branding.
# POSTIZ_VERSION below is the only place the version lives. The weekly postiz-update workflow bumps it in a pull
# request; merging builds ghcr.io/tomdowling/ds-social-poster:<version>. Nothing else in Postiz is changed.
ARG POSTIZ_VERSION=v2.25.0
FROM ghcr.io/gitroomhq/postiz-app:${POSTIZ_VERSION}

COPY brand /ds-brand
RUN node /ds-brand/apply.mjs \
 && cd /app \
 && NODE_OPTIONS="--max-old-space-size=6144" pnpm run build:frontend \
 && rm -rf /app/apps/frontend/.next/cache

LABEL org.opencontainers.image.source="https://github.com/TomDowling/ds.social-poster" \
      org.opencontainers.image.description="Postiz with Digital Space branding" \
      org.opencontainers.image.licenses="AGPL-3.0"
