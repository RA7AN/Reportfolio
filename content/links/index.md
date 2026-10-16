---
# links page — the /links "link in bio" list.
#
# The JSON body has two separate lists, because the page renders them two
# different ways:
#
#   "cards"    the stacked rows at the top: a bold title, a muted subtitle,
#              and an arrow. Use these for anything worth a line of
#              explanation — pages on this site, booking links, newsletters.
#
#   "socials"  the row of round logos at the bottom. These are icon-only, so
#              each one needs a "label" for screen readers and tooltips.
#
# Both lists keep the order you write them in; there is no sortOrder.
#
# Every entry:  { "title": "...", "subtitle": "...", "href": "..." }   (cards)
#               { "icon": "...", "label": "...", "href": "..." }      (socials)
#
# "href" may be a path on this site ("/projects", "/resume") or a full URL.
# Site paths open in the same tab; full URLs open in a new one.
#
# "icon" must be one of: github, linkedin, twitter, orcid, mail, rss,
# instagram, youtube, facebook. Anything else fails the build.
#
# "intro" is the one-line subtitle under your name. Leave it out to hide it.
#
# Set either list to [] to drop that section.
# Keep the body valid JSON: double quotes around keys and values, no trailing
# commas. A malformed file fails the build with a file-specific error.
type: "links"
lastUpdated: "2026-10-16T00:00:00.000Z"
---

{
  "intro": "engineer, researcher, and dreamer",
  "cards": [
    { "title": "portfolio", "subtitle": "the full story", "href": "/" },
    { "title": "projects", "subtitle": "things i've built and shipped", "href": "/projects" },
    { "title": "writing", "subtitle": "essays and notes", "href": "/blog" },
    { "title": "resume", "subtitle": "the one-page version", "href": "/resume" },
    { "title": "community", "subtitle": "the rooms i learned in", "href": "/community" },
    { "title": "work with me", "subtitle": "schedule a call", "href": "https://cal.com/placeholder" },
    {
      "title": "newsletter",
      "subtitle": "occasional emails, no schedule",
      "href": "https://placeholder.substack.com"
    }
  ],
  "socials": [
    { "icon": "github", "label": "github", "href": "https://github.com/RA7AN" },
    {
      "icon": "linkedin",
      "label": "linkedin",
      "href": "https://linkedin.com/in/abdul-jawwad-2ba58b23b"
    },
    { "icon": "twitter", "label": "twitter", "href": "https://twitter.com/abdljwwd" },
    { "icon": "orcid", "label": "orcid", "href": "https://orcid.org/0009-0008-1838-7713" },
    { "icon": "mail", "label": "email", "href": "mailto:hey.jawwad@gmail.com" },
    { "icon": "rss", "label": "rss feed", "href": "/rss.xml" },
    { "icon": "instagram", "label": "instagram", "href": "https://instagram.com/placeholder" },
    { "icon": "youtube", "label": "youtube", "href": "https://youtube.com/@placeholder" },
    { "icon": "facebook", "label": "facebook", "href": "https://facebook.com/placeholder" }
  ]
}
