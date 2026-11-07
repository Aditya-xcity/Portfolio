# Aditya Bhardwaj — Portfolio

My personal developer portfolio, featuring projects in mobile development, computer vision, and backend systems.

**Live website:** [adityaweb.xyz](https://adityaweb.xyz/)

## Features

- Home page with selected projects and a downloadable résumé.
- Project showcase and contact page.
- Light and dark themes, with the selected theme saved locally.
- Responsive layouts, keyboard focus styles, and a skip-to-content link.

## Built with

HTML, CSS, and vanilla JavaScript. This static site needs no build step or package installation.

## Main files

| File | Purpose |
| --- | --- |
| `index.html` | Home page and résumé download |
| `projects.html` | Project showcase |
| `connect.html` | Contact and profile links |
| `Aditya-Bhardwaj-Resume (1).pdf` | PDF served by the résumé download button |
| `CNAME` | Custom domain configuration |

## Run locally

Clone the repository and serve its root directory:

```sh
git clone https://github.com/Aditya-xcity/Portfolio.git
cd Portfolio
python -m http.server 8000
```

Open [localhost:8000](http://localhost:8000). Use a local HTTP server so navigation links starting with `/` resolve correctly.

## Update the résumé

Replace `Aditya-Bhardwaj-Resume (1).pdf` in the repository root with the latest PDF, keeping the filename unchanged. The home page links directly to `Aditya-Bhardwaj-Resume%20(1).pdf` and requests the download filename `Aditya-Bhardwaj-Resume.pdf`.

If you rename the source PDF, update the download link in `index.html` as well. After publishing, click **Download résumé (PDF)** on the live site to verify it.

## Publishing

The site uses GitHub Pages and the custom domain configured in `CNAME`. Commit changes to the publishing branch and check the repository Actions tab for deployment status.

## Author

[Aditya Bhardwaj](https://github.com/Aditya-xcity)
