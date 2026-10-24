# Digital Space Social Poster

[Postiz](https://github.com/gitroomhq/postiz-app) with Digital Space branding, running at
https://social.digital-space.io.

TikTok and Meta app review need the app to show our own name and logo, not a third party's. This repo is
a thin layer on the official Postiz image. It changes the branding only:

- `brand/overrides/`: our logo in the sidebar and on the sign-in page; Postiz's testimonials removed.
- `brand/apply.mjs`: renames "Postiz" to "Digital Space Social Poster" wherever people can read it, then
  the frontend is rebuilt. It stops the build if Postiz has moved anything it expects.
- `brand/public/`: logo and favicon files.

## Update Postiz

1. Change `POSTIZ_VERSION` in `Dockerfile` and `.github/workflows/build.yml`.
2. Push to `main`. GitHub Actions builds `ghcr.io/tomdowling/ds-social-poster:<version>`.
3. If the build fails at a `ds-brand:` line, Postiz moved something: fix `brand/apply.mjs`.
4. Point the Coolify service at the new tag (runbook: `Infra/Servers/runbooks/postiz.md`).

## Licence

Postiz is AGPL-3.0, and so is this. This repo is the source of the version we run.
