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
- The homepage randomly selects only one of its market videos per visit; these are decorative and illustrative, not live price data, and must remain muted, looping, motion-preference aware, and visually subordinate to the screener.
- Reuse shared About and Connect sections on the homepage and their standalone pages so public company details and official profiles stay consistent.
- Keep Screener, Methodology, About, and Connect in one linear homepage flow, with homepage navigation scrolling to those sections; retain standalone section URLs for existing bookmarks.
- Style shared About and Connect sections as reference-matched intro/badge/two-column feature cards followed by a centered community heading and two-column profile cards; keep official facts and links unchanged so the design stays credible.
- Keep Chartink and Screener.in links in separate input state so switching tabs never submits a link to the wrong service; support Chartink's scan-run-token and clause forms while preserving returned row order.
- Normalize public Screener.in screen URLs, read every listed page in source order, and reject partial results when access is blocked or rate-limited; otherwise a shared link can silently omit stocks.
- Mount the decorative cursor accent in the shared site shell so it behaves consistently on public pages, and disable it for touch and reduced-motion users to preserve native interaction.
- Keep bulk results in source order, show status beside each stock in a pinned identity column, and paginate only the presentation so large screens remain readable without dropping data.
