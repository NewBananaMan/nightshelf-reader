# NightShelf — private EPUB reader site

NightShelf is a static, mobile-friendly EPUB reading web app. It starts in dark mode, supports chapter/table-of-contents navigation, font-size controls, progress memory, multiple EPUBs in a local library, and optional Home Screen use on iPhone.

## Privacy

This package does not include any book text. Imported EPUB files are stored in IndexedDB in the reader's browser on that device. The app does not upload book files to a server. Keep a backup of your original EPUBs in Files, because clearing browser website data can remove the local library.

The reader uses epub.js 0.3.93 from jsDelivr. The service worker best-effort caches this dependency after a successful first visit. The first site load therefore needs a connection.

## Publish with GitHub Pages

1. Create a new **public** GitHub repository (for example `nightshelf-reader`). Do not upload your novels or EPUBs to the repository.
2. In the repository, select **Add file → Upload files** and upload the contents of this folder (`index.html`, `manifest.webmanifest`, `sw.js`, `icon.svg`, `apple-touch-icon.png`, and `README.md`).
3. Commit the files to the `main` branch.
4. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
5. Wait for GitHub Pages to publish, then use the URL shown in Settings → Pages. The first deploy may take several minutes.
6. Open that URL in Safari on iPhone. Tap Share → **Add to Home Screen**; turn on **Open as Web App** if offered.
7. Use **Add EPUB books** to choose the EPUB from the Files app. The book remains local to the device/browser.

GitHub Pages on the free plan requires a public repository, so the reader source code is public. Your book contents are not included in the repo; the web app simply reads files you choose in Safari. Do not upload copyrighted EPUB content to the repository.

## Run locally for a quick preview

Open `index.html` in a browser while online. For service-worker/PWA features, use an HTTPS host such as GitHub Pages. A direct `file://` open may not allow the service worker to register.
