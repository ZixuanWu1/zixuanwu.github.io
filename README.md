# Zixuan Wu's academic website

A Jekyll academic website using the original Academic Pages default theme, layouts, sidebar, navigation, and light/dark theme toggle.

## Edit content

- `_pages/about.md`: biography and recent publications.
- `_pages/teaching.html`: teaching, mentoring, and peer review. Add `images/pupu.jpg` to replace Pupu's photo placeholder automatically.
- `_data/profile.yml`: contact information, education, research interests, and service.
- `_data/publications.yml`: the shared bibliography used on the homepage and publications page.
- `_data/experience.yml`, `_data/teaching.yml`, `_data/talks.yml`: professional and academic activities.
- `_data/navigation.yml`: main navigation.
- `_config.yml`: site identity and sidebar information in `author`.
- `_layouts/single.html`, `_layouts/archive.html`, and `assets/css/main.scss`: the original Academic Pages layouts and theme styles.

For a publication, use `status: published`, `preprint`, or `preparation`. Only published articles and preprints are displayed on the publications page. Set `selected: true` and add a short `summary` to feature it on the homepage. Keep author order consistent with the current paper. `links` can contain paper, code, and other verified resources.

The sidebar uses `images/zixuan.jpg` in a 175px circular frame. Personal content is kept in the page and data files, and rendered with the template's native typography and publication-list styles. Template posts, sample publications, sample PDFs, and unused demo pages are excluded from the build. The CV and Experience pages and their navigation links remain removed.

## Pupu's likes

The Mentoring section uses `images/pupu.jpg` and a small like button implemented in `assets/js/pupu-likes.js`. Counts are shared across visitors through [Count API](https://countapi.mileshilliard.com/), using the public key `zixuanwu1_github_io_pupu_likes_v1`. Reads do not increment the count; the first successful like creates the counter. No API key or visitor account is required, and no third-party JavaScript is loaded.

The browser remembers a successful like in local storage to discourage repeated clicks. This is a casual counter, not a verified count of unique people: clearing storage, using another browser, or directly calling the public API can change the total. The external service has no uptime guarantee. Failed requests display an unavailable or retry message rather than inventing a count.

Local previews on localhost or 127.0.0.1 automatically use a separate `_preview` counter, so testing never adds to the live total. Keep the production key unchanged when updating or moving the website to preserve the total. Requests omit cookies and the page referrer.

Run `node --test scripts/test-pupu-likes.cjs` to check persistence, repeat-click protection, preview isolation, and failure handling without calling the external service.

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

The repository remote is `ZixuanWu1/zixuanwu1.github.io`, so `_config.yml` is configured as a **user site** at the account's root URL:

```yaml
url: https://zixuanwu1.github.io
baseurl: ""
repository: ZixuanWu1/zixuanwu1.github.io
```

GitHub Pages is enabled using **Deploy from a branch**, with `master` and `/ (root)` selected. Push changes to `master` to update `https://zixuanwu1.github.io/`.

For a custom domain, update `url` and `baseurl` to match. Internal links and legacy redirects use Jekyll's URL filters to respect that configuration.

## Content sources

Content was checked on November 18, 2026 against the supplied two-page resume, [Google Scholar](https://scholar.google.com/citations?user=GBNOlFQAAAAJ&hl=en), the linked paper pages, and the authors' [SpeedCP repository](https://github.com/yeojin-jung/speedcp).

- SpeedCP uses the author order shown in the current arXiv version and Scholar: Liu, Jung, Wu, Jeong, Donnat. Its ICML 2026 venue follows the resume and the authors' repository; Scholar still lists the preprint.
- The binary-traits Mendelian randomization preprint uses its original 2024 posting year, with the revised version linked from the resume.
- The MCMC journal volume and page ranges follow Scholar where they are available.
- Expected Ph.D. completion and internship results follow the supplied resume. Advisor relationships and citation metrics are not inferred.

## Attribution

Original template: [Academic Pages](https://github.com/academicpages/academicpages.github.io), derived from [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes). The original license is retained in `LICENSE`.
