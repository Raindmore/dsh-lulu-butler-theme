# 暖橙书房 1.0 — design QA

final result: passed

## Evidence and comparison state

- Source visual truth: `docs/design-reference.png` (public copy: `docs/design-reference.webp`), the selected warm-study mockup.
- Rendered implementation: `http://127.0.0.1:4179/preview/index.html`, screenshot `docs/preview-desktop.png` / `docs/preview.webp`.
- Matching state: fresh welcome page, light theme, expanded sidebar, empty draft, scene and companion enabled.
- Source / implementation: both **1487 × 1058 pixels**, CSS viewport **1487 × 1058**, effective density **1 image pixel per CSS pixel**. No browser chrome or density rescaling in comparisons.
- Full comparison: `docs/comparison-desktop.webp` (source left, implementation right, 2974 × 1058).
- Focused comparisons: `docs/comparison-hero.webp`, `docs/comparison-composer.webp`, `docs/comparison-brand.webp`, `docs/comparison-footer.webp`. Both images were opened together, not assessed from separate memory.
- Additional captures: `docs/preview-1280.webp` (**1280 × 720**), `docs/preview-mobile.webp` (**390 × 844**), `docs/native-light.webp` (**1487 × 1058**) and `docs/native-dark.webp` (**1487 × 836**).
- Native evidence is the official `@deepseek-ai/dsh@0.2.1-rc.2` Web GUI with the installed plugin in an isolated profile. Different native controls/content/sidebar width are explicit platform constraints, not part of the mock-shell pixel comparison. Night mode has no source image; it is a supplemental usability check.

## Findings and comparison history

1. **P2 — hero art too small.** First combined full-view and hero crop comparison showed a substantially smaller character than the mock. Enlarged the raster scene, aligned it to the bottom-right, moved the copy up and adjusted headline size. A trial overscaled/cropped the head; reduced to the final contained scene sizing. The current full-view and focused hero comparison show the intended character prominence, intact bun/ears, two-line copy and wide composer.
2. **P2 — short-window clipping / narrow-screen copy overlap.** At 1280 × 720, the art extended above the visible content region. Added a shorter scene treatment. At 390 × 844, separated the scene and headline vertically. Recaptured both sizes: intact character, usable input and suggestion buttons, and document scrollWidth does not exceed innerWidth.
3. **P1 — footer mascot exposed only a small fragment and tilted the wrong way.** User specifically flagged this. Changed the angle from −7° to **+18°**, raised the head, removed the inset clipping edge, and gave short windows a 108px footer. The final combined footer comparison shows the same clockwise peeking direction as the source, two visible eyes and a substantial orange muzzle. Current native short-window capture also verifies the correction.
4. **P2 — native integration differences.** Native branding clipped its subtitle due to a fixed-height ancestor; made only the occupied brand ancestors auto-height. The rc.2 blank-session screen does not render `conversation.composer.dock`; registered suggestions in the supported `conversation.input.dock` and used flex order to put them below the card. Verified in the real client that all three controls render and fill the editor.

No actionable P0/P1/P2 remains in the compared states.

## Required fidelity surfaces

- **Typography:** PingFang SC / native system sans fallback, bold two-line heading and restrained supporting text. Source copy and wrapping retained. Native utility controls keep the host's density. Small differences in weight/antialiasing are P3.
- **Spacing/layout rhythm:** 340px mock sidebar, broad right-aligned art, left copy, full-width rounded composer and three centered prompts. Native sidebar remains draggable and its existing host width is respected. All tested sizes retain input and persistent controls.
- **Colors/tokens:** Cream, warm brown, orange and cocoa palettes mapped to native semantic aliases. Primary action uses a solid, slightly darker accessible orange rather than the mock's painted gradient. Both palettes' body text and primary action contrast pass automated AA checks.
- **Image quality:** Real generated day/night raster scenes and transparent character cutout, using the supplied identity. No CSS mascot approximations. WebP assets are embedded in the native bundle. Bun/ears remain visible; footer now exposes the intended face direction. Minor bun/texture differences from the source are P3.
- **Copy/content:** Main headline, English eyebrow, supporting sentence, three prompts and footer copy retained. Mock workspace/conversation names in the local preview are demonstration data; installed theme uses real native data.

## Functional checks

- Native suggestion click fills the contenteditable editor without submitting. Existing draft text remains before appended prompt.
- Native scene/companion settings immediately remove and restore their respective DOM; all three preferences survive initialization. Deep/light appearance follows the host setting.
- Theme master switch restores the host UI while retaining a settings entry for re-enabling.
- Actual plugin disable removes injected style, theme attributes and registrations; re-enable restores them with one style layer.
- Local preview: suggestion → draft → explicit preview submission → local response state → return to welcome.
- Latest preview and native browser console: no captured errors/warnings.
- Fresh remote installation using `github:Raindmore/dsh-lulu-butler-theme#warm-study-v1` succeeded with the official DSH CLI. Installed client bundle is byte-for-byte identical to the tested bundle.
- `npm test`: 3 passed, covering persisted settings, bad/unavailable storage and both palettes' contrast.
- No model/network completion was tested: the isolated profile intentionally has no configured model. No claim of installation in the user's everyday desktop profile.

## Follow-up polish (P3)

The mock has ornamental orange strokes and subtle paint-like gradients absent from the functional theme. The footer bun and icon stroke weights can be refined further. These do not affect the requested pose, cropping, controls or interaction.

## Implementation checklist

- [x] Same-viewport source/rendered full comparison and readable focused comparisons.
- [x] Hero scale, short-window crop and narrow-screen overlap fixed and recaptured.
- [x] User-requested lower-left angle and exposure fixed in preview and native client.
- [x] Native slot behavior, settings and lifecycle cleanup verified.
- [x] Portable precompiled package and installation instructions prepared.
