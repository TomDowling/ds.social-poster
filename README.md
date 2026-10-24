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

Every Friday the `postiz-update` workflow checks for a new Postiz release. If there is one, it bumps
`ARG POSTIZ_VERSION` in the `Dockerfile` on a branch, test-builds it with the branding, and opens a pull request
(titled "branding needs fixing" if the test build failed).

1. Read the Postiz release notes linked in the PR. Merge it: GitHub Actions builds
   `ghcr.io/tomdowling/ds-social-poster:<version>`.
2. Ops Steward proposes the switch in the Saturday update check; Tom approves in DS Panel; `ops-apply` takes a
   DB backup and changes the image tag in Coolify on Sunday (runbook: `Infra/Servers/runbooks/postiz.md`).
3. If a build fails at a `ds-brand:` line, Postiz moved something: fix `brand/apply.mjs` on the PR branch.

Run the check by hand: Actions → postiz-update → Run workflow.

## Licence

Postiz is AGPL-3.0, and so is this. This repo is the source of the version we run.
