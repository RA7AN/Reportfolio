import { useEffect } from "react";

type SeoProps = {
  title: string;
  description?: string;
};

export function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = title;

    if (!description) return;
    const ensure = (name: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      return el;
    };

    const d = ensure("description");
    if (d) d.content = description;

    const ogTitle = (() => {
      let el = document.querySelector(`meta[property="og:title"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", "og:title");
        document.head.appendChild(el);
      }
      return el;
    })();
    ogTitle.content = title;

    const ogDesc = (() => {
      let el = document.querySelector(`meta[property="og:description"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", "og:description");
        document.head.appendChild(el);
      }
      return el;
    })();
    ogDesc.content = description;

    const ogType = (() => {
      let el = document.querySelector(`meta[property="og:type"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", "og:type");
        document.head.appendChild(el);
      }
      return el;
    })();
    ogType.content = "website";
  }, [title, description]);

  return null;
}
