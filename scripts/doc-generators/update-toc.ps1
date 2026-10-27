<#
    Refresh the table of contents of each Word document named, through Word, and save it.

      powershell -NoProfile -ExecutionPolicy Bypass -File scripts/doc-generators/update-toc.ps1 "Documents\A.docx"

    A step of "sync docs". The contents listing is a field Word fills in, so its page
    numbers go stale when an edit moves the pages. Refresh it BEFORE the PDF is made:
    a PDF bakes in whatever page numbers the contents had at that moment.

    A fresh Word per document, as in publish-documents.py's export (a shared instance
    has disconnected part way through a batch in Conversant). Only the Word this starts
    is used; one Ken has open is never touched. A document with no contents listing is
    left as it is. Exit code 0 if every document was handled, 1 if any failed.
#>
param([Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)][string[]]$Path)

$failed = 0
foreach ($p in $Path) {
    $full = (Resolve-Path -LiteralPath $p -ErrorAction SilentlyContinue)
    if (-not $full) { Write-Host "  MISSING $p"; $failed++; continue }
    $word = $null; $doc = $null
    try {
        $word = New-Object -ComObject Word.Application
        $word.Visible = $false
        $word.DisplayAlerts = 0
        $doc = $word.Documents.Open($full.Path, $false, $false)
        if ($doc.TablesOfContents.Count -eq 0) {
            Write-Host ("  NO CONTENTS " + [System.IO.Path]::GetFileName($full.Path))
        } else {
            foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
            $doc.Save()
            Write-Host ("  REFRESHED " + [System.IO.Path]::GetFileName($full.Path) + " (" + $doc.ComputeStatistics(2) + " pages)")
        }
    } catch {
        Write-Host ("  FAILED   " + [System.IO.Path]::GetFileName($full.Path) + " - " + $_.Exception.Message)
        $failed++
    } finally {
        try { if ($doc) { $doc.Close(0) } } catch { }
        try { if ($word) { $word.Quit() } } catch { }
    }
}
if ($failed -gt 0) { exit 1 }
exit 0
