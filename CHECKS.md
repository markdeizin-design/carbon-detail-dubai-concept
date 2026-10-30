# Verification — 2026-10-30

- `npm run build`: generates all four pages, local styles and browser modules without dependencies.
- `npm test`: 15 checks covering all four service IDs/names/prices, encoded WhatsApp links and messages, unknown-service fallback, page links/anchors/local assets, English markup and concept notices, selected-service updates, reduced-motion source gating, play/pause labels, mobile menu focus/inert behavior and Escape.
- Browser checks: all four pages at desktop width 1280; phone/tablet content viewports of 390 and 768 pixels; additional Services check at 320 pixels. Responsive sizes were rendered inside same-origin iframes because the in-app browser viewport override did not take effect. No horizontal content overflow or broken images was found.
- Browser interactions: selection changed to Interior Deep Cleaning and Ceramic Coating with the correct decoded message and destination; mobile menu opened, first navigation link received focus, Tab continued through the navigation, Escape closed the menu; service process details opened with Enter.
- Header was observed hidden on downward scrolling and visible after upward scrolling. Keyboard focus and open-menu guards were also checked in code.
- Hero playback confirmed in the browser: duration 30 seconds, muted, progressing playback and working pause button. Full output decoded with FFmpeg: 900 frames, 1920 × 1080, 30 fps, no audio. Final scene grid and loop seam checked; no title/popup-caption scenes included.
- Reduced-motion automatic-video suppression and explicit-play behavior are covered by executing the actual app script with a controlled media-query match. Reduced-motion reveal transitions are disabled in CSS. A native operating-system reduced-motion setting was not toggled.
- No browser console errors were captured in the final desktop page navigation.

No WhatsApp messages were sent and no real bookings were made. Testing used the desktop browser and controlled responsive frames, not physical iOS/Android hardware. Commercial reuse rights for the user-supplied YouTube footage were not independently verified.
