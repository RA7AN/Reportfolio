---
# posts worth keeping — feeds the "on the timeline" section on the landing page.
#
# Edit the JSON array below: one object per post. All three keys are required
# on every object:
#
#   {
#     "sortOrder": 1,                           display order; must be unique (1 shows first)
#     "url": "https://x.com/abdljwwd/status/…",
#     "anonymous": false
#   }
#
# - "sortOrder": position in the grid. Duplicate numbers fail the build.
# - "url": the post link. Both platforms work; the platform is detected from
#   the URL:
#     X:        https://x.com/abdljwwd/status/…
#     LinkedIn: open the post → ⋯ → "Copy link to post"
#               (https://www.linkedin.com/in/abdul-jawwad-2ba58b23b/posts/activity:…)
#               lnkd.in shortlinks cannot be embedded — paste the full post URL.
# - "anonymous": true swaps the avatar, name, and handle for an anonymous
#   stand-in (Anonymous / @johndoe) rendered in the embed's own look, and
#   blocks every click, so the card cannot link back to your account
#   (works for X and LinkedIn; video play buttons also become unclickable).
#   false shows the normal, fully-linked embed.
#
# Notes:
# - Posts must be public or the embed renders blank.
# - LinkedIn posts render collapsed (clipped with a "...more" button), the way
#   they appear in the LinkedIn feed.
# - Keep the body valid JSON: double quotes around keys and URLs, no trailing
#   commas. A malformed file fails the build with a file-specific error.
# - The first four posts show before "load more" reveals the rest.
# - Set the array to [] to hide the section entirely.
type: "timeline"
count: 6
lastUpdated: "2026-10-14T00:00:00.000Z"
---

[
  {
    "sortOrder": 1,
    "url": "https://x.com/trometheus7/status/2086573540908654876",
    "anonymous": false
  },
  {
    "sortOrder": 2,
    "url": "https://x.com/trometheus7/status/2082235837752963395",
    "anonymous": true
  },
  {
    "sortOrder": 3,
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7337064160997855232/",
    "anonymous": false
  },
  {
    "sortOrder": 4,
    "url": "https://x.com/trometheus7/status/2101403312641699895",
    "anonymous": false
  },
  {
    "sortOrder": 5,
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7394721199445958657/",
    "anonymous": false
  },
  {
    "sortOrder": 6,
    "url": "https://www.linkedin.com/posts/abdul-jawwad-2ba58b23b_guinnessworldrecords-kanz-ai-ugcPost-7491230550997934081-MbvJ/",
    "anonymous": false
  }
]
