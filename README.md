# Ashley Buenafe — Portfolio

Personal portfolio website for Ashley Buenafe, graphic designer & illustrator.

## 🚀 Quick Setup (GitHub Pages hosting)

### 1. Create a GitHub repo

Go to [github.com/new](https://github.com/new) and create a repo named `portfolio`.

### 2. Push this code

```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git add .
git commit -m "Initial portfolio"
git push -u origin main
```

### 3. Enable GitHub Pages

- Go to your repo → **Settings** → **Pages**
- Under **Source**, select **GitHub Actions**
- The workflow auto-deploys on every push

Your site will be at: `https://YOUR_USERNAME.github.io/portfolio`

---

## 📸 Adding Your Photo

1. Put your photo in this folder as `photo.jpg`
2. In `index.html`, find the `.about__photo-placeholder` div and replace with:

```html
<img src="photo.jpg" alt="Ashley Buenafe" style="width:100%;height:100%;object-fit:cover;" />
```

## ✏️ Updates

- **Contact links** — update the `href` values in the Contact section
- **Work images** — replace colored card blocks with real `<img>` tags
- **Colors** — edit `:root` variables at the top of `style.css`

## 🔤 Fonts

- **Angeris Pixel** — CDNFonts (free for personal use)
- **Jost** — closest free alternative to Maison Neue (Google Fonts)

To use Maison Neue: add `@font-face` in `style.css` and update `--font-body`.
