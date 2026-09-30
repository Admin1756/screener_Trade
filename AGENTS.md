<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the bulk Chartink/Screener.in/list screener on `/`; redirect legacy `/check` and `/scanner` there so the retired single-stock search never reappears and old bookmarks still work.
- Treat the published zamzam-capital.com site as the source for official public profile links and company facts; never infer unpublished screening thresholds or imply third-party endorsement.
- Keep dark as the default and persist light-mode choice locally through the shared theme toggle; CSS semantic tokens own both themes so every page remains consistent.
- Zamzam AI Capital's admin upload is the authoritative stock source; this site's bulk screener reads its public stock rows through a server-only read-only connection, and must never fall back to this site's separate stock table for compliance.
- The homepage's candlestick video is decorative and illustrative, not live price data; keep it muted, motion-preference aware, and visually subordinate to the screener.
