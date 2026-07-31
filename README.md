# Soft Core World War

A zero-build static transmission from the Department of Mental Infrastructure.

## Local preview

Open `index.html` directly, or run a tiny local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

Every push to `main` runs the GitHub Pages workflow in `.github/workflows/deploy-pages.yml`.

In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions** if it is not already selected.
