---
layout: academic
title: Curriculum vitae
permalink: /cv/
eyebrow: Zixuan Wu
redirect_from:
  - /resume
  - /resume/
---

<p class="cv-contact"><strong>Zixuan Wu</strong> · Chicago, Illinois<br><a href="mailto:{{ site.data.profile.email }}">{{ site.data.profile.email }}</a> · <a href="{{ site.data.profile.scholar | escape }}">Google Scholar</a></p>
<button class="print-button" type="button" onclick="window.print()">Print / Save as PDF</button>

<section class="cv-section"><h2>Education</h2>{% include education-list.html gpa=true %}</section>
<section class="cv-section"><h2>Research interests</h2><p>{{ site.data.profile.interests | join: '; ' }}.</p></section>
<section class="cv-section"><h2>Published articles</h2>
{% assign published = site.data.publications | where: 'status', 'published' %}
{% for paper in published %}{% include publication-entry.html paper=paper compact=true %}{% endfor %}
</section>
<section class="cv-section"><h2>Preprints</h2><p class="publication-notes">* Equal contribution. Years refer to the first preprint posting.</p>
{% assign preprints = site.data.publications | where: 'status', 'preprint' %}
{% for paper in preprints %}{% include publication-entry.html paper=paper compact=true %}{% endfor %}
</section>
<section class="cv-section"><h2>Manuscripts in preparation</h2>
{% assign preparation = site.data.publications | where: 'status', 'preparation' %}
{% for paper in preparation %}{% include publication-entry.html paper=paper compact=true %}{% endfor %}
</section>
<section class="cv-section"><h2>Professional experience</h2>{% include experience-list.html %}</section>
<section class="cv-section"><h2>Teaching experience</h2><p>Teaching Assistant, University of Chicago</p>{% include teaching-list.html %}</section>
<section class="cv-section"><h2>Conference presentations and posters</h2>{% include talks-list.html %}</section>
<section class="cv-section"><h2>Service</h2><p>Reviewer for {{ site.data.profile.service | join: '; ' }}.</p></section>
