# SCWW Photo Uploads

Use this branch for gallery images.

1. Upload JPG, JPEG, PNG, GIF, or WEBP files into this `assets/photos/` folder.
2. Open `manifest.json` and add each exact filename as a quoted item.
3. Keep valid JSON, for example:

```json
[
  "james-at-window.jpg",
  "night-drive.png",
  "market-temple.webp"
]
```

4. Open a pull request from `photo-uploads` into `main`, then merge it.

The live gallery reads this manifest in order. Filenames are case-sensitive.
