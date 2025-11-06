## Current Issues and Debugging Notes (2025年9月3日)

### 1. Hamburger Menu Issue

*   **Problem:** The hamburger menu does not visually appear/open on mobile devices, despite JavaScript successfully toggling the necessary classes.
*   **Details:**
    *   JavaScript (`js/main.js`) is confirmed to be running and correctly toggling `nav-open` class on `<body>` and `<nav id="main-nav">`, and `active` class on `<div class="hamburger-menu">` upon click. Console logs confirm this.
    *   Initial attempts to fix involved adding/removing `!important` flags in `css/modern-style.css` to force display properties, but this did not resolve the visual issue.
    *   A debugging step was attempted to make the mobile navigation *always visible* (by commenting out `opacity: 0;` and `visibility: hidden;` in `.nav` within the mobile media query). Even with this, the menu did not appear, suggesting a deeper CSS conflict.
*   **Current Hypothesis:** There is a persistent CSS conflict or an unexpected interaction with `position`, `z-index`, `overflow`, or other layout properties that is preventing the mobile navigation from being rendered visibly, even when its `display` and `visibility` properties are theoretically set correctly.
*   **Current State:** JavaScript is confirmed working, but CSS is preventing visual display. The last CSS debugging change (commenting out `opacity` and `visibility`) has been reverted.

### 2. 404 Error

*   **Problem:** The browser console shows `Failed to load resource: the server responded with a status of 404 (NOT FOUND)`.
*   **Details:** The specific resource causing the 404 error has not yet been identified from the provided console output. Further investigation using the browser's network tab in developer tools is required to pinpoint the missing file.

### 3. `examples-header` PC Alignment Issue

*   **Problem:** On the "事例集" (`examples.html`) page, the content within the `examples-header` (specifically the `stat-item` elements) appears left-aligned on PC, while it is correctly centered on mobile.
*   **Details:**
    *   CSS adjustments were made to `.examples-stats` (using `display: flex`, `justify-content: space-evenly`, `max-width`, `margin: auto`, `flex-wrap: wrap`) and `stat-item` (using `flex: 1`, `min-width`, `max-width`) to improve centering and distribution.
    *   The `examples-header`'s padding and `h1` font-size, as well as `stat-number`'s font-size, were unified to the mobile-friendly values across all devices.
*   **Current State:** Despite these CSS adjustments, the user still reports that the `examples-header` content remains left-aligned on PC. This suggests the centering issue might be more complex or related to other layout properties affecting the `examples-stats` container or its parent on larger screens.