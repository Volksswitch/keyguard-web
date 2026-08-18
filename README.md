# Keyguard Designer — keyguard.volksswitch.org

The Keyguard Designer web app, served from its own address.

A browser-based tool that lets AAC clinicians design keyguards without installing
anything: it runs `keyguard.scad` entirely inside Chrome or Edge. Public domain
(CC0), by Volksswitch — www.volksswitch.org

## Why this repository exists

The app used to be served from `volksswitch.github.io/keyguard-designer-web/`, an
address shared with every other Volksswitch app ever published there — and one
that many school and enterprise networks block outright, so the clinicians who
most needed the tool could not open it at all.

This is the app's own address. It starts at **release 100**, so the release number
by itself says which address a clinician is on: anything below 100 is the old one.

The move is described in full in `KEYGUARD-MIGRATION-PLAN.docx`, which lives in the
`keyguard-designer-web` repository next to this one.

## How release 100 was built

By **deletion only**, from release 21 of the old app, using that repository's
`scripts/seed-new-origin.py`. Everything that exists to move people off the old
address — asking them to save a copy of their settings, checking whether the move
is armed, and the crossing itself — is fenced in the source and was stripped out.
None of it is switched off here; it is not present.

What was kept is the other half: taking delivery of settings from someone arriving,
putting them back from the project folder, the reminder to retire the old bookmark
and icon, and saving or loading a copy from the About tab — which is where saving
lives now that there is no banner offering it.

## Serving it locally

```
python -m http.server 8000
```

then open `http://localhost:8000/app.html`. The File System Access API needs a
secure origin, so `localhost` or HTTPS — opening the file directly will not work.

## The two files that are not the app

- `CNAME` — claims `keyguard.volksswitch.org`. Committed so that a later deploy
  cannot silently drop the custom domain.
- `move-probe.json` — arms the move from the old address. `"ready": true` starts
  clinicians crossing on their next visit; `false` stops it. It is read on every
  visit, so arming and disarming need no release.

## While it is still at the temporary address — a trap worth knowing

Until `keyguard.volksswitch.org` is attached, this app is served from
`volksswitch.github.io/keyguard-web/` — which is **the same origin as the old
app** at `volksswitch.github.io/keyguard-designer-web/`. Browsers scope stored
settings to the origin and ignore the path, so at the temporary address the two
apps **share one set of settings**. A change made in one is seen by the other.

Nothing is at risk — release 100 has no departure code in it, so it cannot mistake
itself for the old address or move anyone anywhere, and it only takes delivery of
settings when someone actually arrives with them.

But it does mean **the temporary address cannot be used to test arriving**. "Did my
settings come across?" has no meaning while both apps read the same storage; the
answer is yes no matter what happens. Test that on the rehearsal rig, where the two
addresses are genuinely separate origins — or wait until the domain is attached,
which is the point at which the new address gets storage of its own.
