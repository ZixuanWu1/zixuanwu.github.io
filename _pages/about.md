---
layout: single
title: Zixuan Wu
permalink: /
description: Ph.D. candidate in Statistics at the University of Chicago. Research in causal inference, high-dimensional statistics, and reliable statistical learning.
redirect_from:
  - /about/
  - /about.html
---

I am a Ph.D. candidate in the [Department of Statistics at the University of Chicago](https://stat.uchicago.edu/), where I am fortunate to work with Professors [Jingshu Wang](https://jingshuw.org/) and [Claire Donnat](https://donnate.github.io/). My research spans causal inference, high-dimensional statistics, and machine learning. I develop methods for Mendelian randomization, which uses genetic variants as instrumental variables to estimate causal effects. I also work on statistical methodology for high-dimensional data and on understanding the performance of machine learning models.

Before beginning my Ph.D., I earned an Honours B.Sc. in Applied Mathematics from the University of Toronto, where I had the opportunity to work with Professor [Jeffrey Rosenthal](https://probability.ca/jeff/) on MCMC convergence and inference. I have also worked on quantitative research at **Optiver** and data science research at **Roblox**.

## Recent news

- **Summer 2026:** Completed a quantitative research internship at **Optiver**.
- **ASHG 2026:** Presented a poster on family-based GWAS in Montreal.
- **SLDS 2026:** Presented a poster on neural network-based link prediction in Brooklyn.

## Recent publications

[All publications]({{ '/publications/' | relative_url }})

{% assign selected = site.data.publications | where: 'selected', true %}
{% for paper in selected %}
{% include publication-entry.html paper=paper summary=true %}
{% endfor %}
