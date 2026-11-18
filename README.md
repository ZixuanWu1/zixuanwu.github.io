# Zixuan Wu's academic website

A Jekyll academic website based on Academic Pages. The public pages use a custom, responsive layout with no client-side framework or third-party scripts.

## Edit content

- `_pages/about.md`: biography and recent highlights.
- `_data/profile.yml`: contact information, education, research interests, and service.
- `_data/publications.yml`: the shared bibliography used on the homepage and publications page.
- `_data/experience.yml`, `_data/teaching.yml`, `_data/talks.yml`: professional and academic activities.
- `_data/navigation.yml`: main navigation.
- `_layouts/academic.html` and `assets/css/academic.css`: layout and visual styles.

For a publication, use `status: published`, `preprint`, or `preparation`. Set `selected: true` and add a short `summary` to feature it on the homepage. Keep author order consistent with the current paper. `links` can contain paper, code, and other verified resources.

The sidebar uses a typographic monogram until a personal photograph is supplied. Template posts, sample publications, sample PDFs, and unused demo pages are excluded from the build.

## Preview and build

In this checkout, an isolated Ruby runtime and the required gems have already been prepared under the ignored `local/` directory. Start the preview with:

```sh
bash scripts/preview.sh
```

Use a supported Ruby development installation (Ruby 3.1 or 3.2 is suitable for the existing GitHub Pages dependency set), then:

```sh
bundle install
bundle exec jekyll serve --baseurl ''
```

The local preview is at `http://127.0.0.1:4000/`. For a production build:

```sh
bundle exec jekyll build
```

`local/`, `_site/`, and Bundler caches are ignored by Git. macOS's system Ruby may lack the headers needed to install native dependencies; use a separate Ruby installation in that case.

## GitHub Pages configuration

The repository remote is `ZixuanWu1/zixuanwu.github.io`, so `_config.yml` is configured as a **project site**:

```yaml
url: https://zixuanwu1.github.io
baseurl: /zixuanwu.github.io
```

GitHub's repository API reported Pages as disabled on November 18, 2026. To publish, push the reviewed changes and enable **Settings → Pages → Deploy from a branch**, selecting the branch containing these changes and `/ (root)`. The resulting default address is `https://zixuanwu1.github.io/zixuanwu.github.io/`.

If the repository is renamed to `ZixuanWu1.github.io`, set `baseurl: ''`. For a custom domain, update `url` and `baseurl` to match. Internal links and legacy redirects use Jekyll's URL filters to respect that configuration.

## Content sources

Content was checked on November 18, 2026 against the supplied two-page resume, [Google Scholar](https://scholar.google.com/citations?user=GBNOlFQAAAAJ&hl=en), the linked paper pages, and the authors' [SpeedCP repository](https://github.com/yeojin-jung/speedcp).

- SpeedCP uses the author order shown in the current arXiv version and Scholar: Liu, Jung, Wu, Jeong, Donnat. Its ICML 2026 venue follows the resume and the authors' repository; Scholar still lists the preprint.
- The binary-traits Mendelian randomization preprint uses its original 2024 posting year, with the revised version linked from the resume.
- The MCMC journal volume and page ranges follow Scholar where they are available.
- Expected Ph.D. completion and internship results follow the supplied resume. Advisor relationships and citation metrics are not inferred.

## Attribution

Original template: [Academic Pages](https://github.com/academicpages/academicpages.github.io), derived from [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes). The original license is retained in `LICENSE`.
