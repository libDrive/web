export default function seo(data = {}) {
  data.title = data.title || "libDrive";
  data.description =
    data.description ||
    "libDrive is a Google Drive media library manager and indexer, similar to Plex, that organizes Google Drive media to offer an intuitive and user-friendly experience.";
  data.image = data.image || "/images/icons/icon-512x512.png";
  data.type = data.type || "website";
  document.title = data.title;
  document
    .querySelector('meta[property="og:title"]')
    .setAttribute("content", data.title);
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", data.description);
  document
    .querySelector('meta[property="og:description"]')
    .setAttribute("content", data.description);
  document
    .querySelector('meta[property="og:image"]')
    .setAttribute("content", data.image);
  document
    .querySelector('meta[property="og:type"]')
    .setAttribute("content", data.type);
}
