---
name: sync-docs
description: The "sync docs" procedure for the Keyguard Designer's published documents (User Manual, Quick Reference Card, IT Request Letter, Keyguard Data Form, Security Overview). Use whenever Ken says "sync docs", or a document on volksswitch.org has to catch up with the app.
---

# "sync docs": bring the documents in line with the app, and publish what changed

Ken, 27 Oct 2026. Moved here from the project's root CLAUDE.md on 30 Oct 2026 (Ken's
/doctor cleanup); the trigger-phrase table there still lists the phrase and points here.

The documents are the five in `scripts/wordpress/documents.json`: User Manual, Quick
Reference Card, IT Request Letter, Keyguard Data Form, and the Security Overview (for IT),
which is built from `SECURITY.md` and has been a standard step here since 30 Oct 2026 (Ken:
"update the documents, create PDFs as appropriate, and upload them (including the security
document)"). (The Product Overview came off the
documents page on 30 Oct 2026 at Ken's request; its .docx stays in `Documents/`, unpublished.) The data form and the IT
letter are published as PDFs you can type into (made by `scripts/doc-generators/fillable_form.py`),
each with its Word file linked beside it ("fillable" and "word" in the list; 30 Oct 2026).
Video 2.4 is made from the data form's pictures, so after changing the form run
`python scripts/doc-generators/data-form-pictures.py`, and "sync videos" re-makes 2.4.

⚠ **Never regenerate a document from `scripts/doc-generators/`:** Ken edits the Word files,
and the manual's contents are filled in by Word. Every change is a surgical edit to the
.docx (Conversant's `docx_safe`), mirrored in its generator so the two don't drift. Every
step backs a document up to `Documents/Doc Backups/` before changing it.

## The eight steps, in order

1. **Text:** read `CHANGELOG.md` since each document's "Last updated" date and correct what
   the app now does differently.
2. **The manual's pictures:** `node scripts/doc-generators/capture-manual-figures.mjs http://localhost:8077`,
   the same with `https://keyguard.volksswitch.org --only um-check.png`,
   `python scripts/doc-generators/label-manual-figures.py`,
   `python scripts/doc-generators/update-manual-figures.py --apply` (each picture found by
   its caption). The first needs the `kgweb-live` preview server running on port 8077.
3. **Video links:** `python scripts/video/add-manual-links.py --apply` (a new video needs its
   section in that script's list first).
4. Put today's date in the "Last updated" line of each document that changed (for the
   security overview, the `_Last updated:_` line of `SECURITY.md`, which should already
   have moved with the app change it describes), then
   `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/doc-generators/update-toc.ps1 <each changed .docx>`.
5. `python scripts/wordpress/publish-documents.py --apply` - PDFs through Word, uploaded, for
   only the documents whose date changed. To do one or a few: `--only "<name>"`, repeated or
   comma-separated, matched against file names and titles (`--only manual --only security`);
   add `--force` for a second change the same day. For the security overview it builds
   `SECURITY.docx` and `SECURITY.pdf` from the markdown and stops at **REPLACE IN PLACE**.
6. **Replace the security overview in place**, when step 5 said so. Its address is in the IT
   letter and in IT departments' hands, and a new upload would get a new one, so it goes
   through WordPress's own screen, which no script can reach (the plugin has no REST route).
   Ask Ken to sign in to WordPress in Chrome (Claude in Chrome must be connected; Claude never
   signs in itself), then open `wp-admin/post.php?post=23435&action=edit` → Replace Media
   (the **enable-media-replace** panel, not the Folders one) → attach `SECURITY.pdf` with
   the file-upload tool → **Just replace the file** → Upload. Then run step 5's command
   again: it downloads the live file, says **CONFIRMED**, and the documents page shows the
   new date. Close the tab. (Considered and declined, 30 Oct 2026: a permanent security
   page that links the current PDF, or the overview as a web page, either of which would
   end the sign-in. Ken chose to keep the file at its address and sign in the few times a
   year it changes. Don't re-propose it.)
7. `python scripts/wordpress/check-links.py`.
8. Tell Ken which documents went up, and list the old copies left in the media library
   (the script prints them) for him to delete.

## ⚠ Give OneDrive a few minutes before Word opens a .docx you just saved (30 Oct 2026)

Twice that day a hidden Word, started to export or check a .docx saved only a moment before,
hung where nobody could see it, while OneDrive was still uploading the file; afterwards that
one file refused to open in Word ("Command failed") until it settled, while a renamed copy
opened at once. Measured: the Quick Reference Card opened ten minutes later; the IT letter
about an hour later, once the stuck Words were closed (Ken approved closing them). So after a
surgical edit, do the other steps first and export last, and run any Word check in a
time-limited background job. A stuck Word is one started with `/Automation`; ask Ken before
closing one.
