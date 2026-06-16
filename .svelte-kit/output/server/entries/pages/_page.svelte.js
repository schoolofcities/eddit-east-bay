import { X as fallback, Y as attr_style, Z as attr, _ as bind_props, $ as stringify, e as escape_html, p as pop, a as push, a0 as ensure_array_like, a1 as attr_class, a2 as clsx, a3 as head } from "../../chunks/index.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
const logoLight = "/eddit-east-bay/_app/immutable/assets/sofc-uoft-logo-blue-colour.CE9pTg4p.svg";
const logos = "/eddit-east-bay/_app/immutable/assets/sofc-uoft-logo-white-colour.BXkjstT2.svg";
const LogoBlack = "/eddit-east-bay/_app/immutable/assets/sofc-uoft-logo-black.C_a__8RB.svg";
const LogoWhite = "/eddit-east-bay/_app/immutable/assets/sofc-uoft-logo-white.DQHODoDx.svg";
function LogoTop($$payload, $$props) {
  let logoType = fallback(
    $$props["logoType"],
    "Blue"
    // 'Blue', 'White', 'Black', 'WhiteOnly'
  );
  let backgroundColor = fallback($$props["backgroundColor"], "var(--brandWhite)");
  $$payload.out += `<div class="logo-container svelte-hd60fy"${attr_style(`background-color: ${stringify(backgroundColor)}`)}><a href="https://schoolofcities.utoronto.ca/" target="_blank" class="logo-link">`;
  if (logoType === "Blue") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<img${attr("src", logoLight)} alt="UofT and School of Cities logos" class="logo svelte-hd60fy"/>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (logoType === "White") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<img${attr("src", logos)} alt="UofT and School of Cities logos" class="logo svelte-hd60fy"/>`;
    } else {
      $$payload.out += "<!--[!-->";
      if (logoType === "Black") {
        $$payload.out += "<!--[-->";
        $$payload.out += `<img${attr("src", LogoBlack)} alt="UofT and School of Cities logos" class="logo svelte-hd60fy"/>`;
      } else {
        $$payload.out += "<!--[!-->";
        if (logoType === "WhiteOnly") {
          $$payload.out += "<!--[-->";
          $$payload.out += `<img${attr("src", LogoWhite)} alt="UofT and School of Cities logos" class="logo svelte-hd60fy"/>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></a></div>`;
  bind_props($$props, { logoType, backgroundColor });
}
function TitleStandard($$payload, $$props) {
  let title = fallback($$props["title"], "");
  let subtitle = fallback($$props["subtitle"], "");
  $$payload.out += `<div class="title-text-container svelte-10fk5dt"><h1 class="svelte-10fk5dt">${escape_html(title)}</h1> `;
  if (subtitle) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<h2 class="svelte-10fk5dt">${escape_html(subtitle)}</h2>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { title, subtitle });
}
function AuthorDate($$payload, $$props) {
  let authors = fallback($$props["authors"], "");
  let graphics = fallback($$props["graphics"], "");
  let research = fallback($$props["research"], "");
  let writing = fallback($$props["writing"], "");
  let date = fallback($$props["date"], "");
  $$payload.out += `<div class="author-date svelte-1q6mw21"><p class="svelte-1q6mw21">`;
  if (authors) {
    $$payload.out += "<!--[-->";
    $$payload.out += `By ${html(authors)}`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (research) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<br/> Research: ${html(research)}`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (graphics) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<br/> Graphics: ${html(graphics)}`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (writing) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<br/> Writing: ${html(writing)}`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <br/> <span id="date" class="svelte-1q6mw21">~ ${escape_html(date)}</span></p></div>`;
  bind_props($$props, { authors, graphics, research, writing, date });
}
function ImageSingle($$payload, $$props) {
  let imageURL = fallback($$props["imageURL"], "");
  let caption = fallback($$props["caption"], "");
  let source = fallback($$props["source"], "");
  let altText = fallback($$props["altText"], "");
  let maxWidth = fallback($$props["maxWidth"], "");
  let link = fallback(
    $$props["link"],
    "Yes"
    // Yes or No open link in new tab
  );
  $$payload.out += `<div class="img-container svelte-omvcjw"${attr_style(`max-width: ${stringify(maxWidth)};`)}>`;
  if (link === "Yes") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<a${attr("href", imageURL)} target="_blank" class="svelte-omvcjw"><img${attr("src", imageURL)}${attr("alt", altText)} loading="lazy" class="svelte-omvcjw"/></a>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<img${attr("src", imageURL)}${attr("alt", altText)} loading="lazy" class="svelte-omvcjw"/>`;
  }
  $$payload.out += `<!--]--> <div class="caption-container"><p><span class="caption-text">${html(caption)}</span> <span class="caption-source">${html(source)}</span></p></div></div>`;
  bind_props($$props, { imageURL, caption, source, altText, maxWidth, link });
}
function GraphicSingle($$payload, $$props) {
  push();
  let svg1080 = fallback($$props["svg1080"], "");
  let svg720 = fallback($$props["svg720"], "");
  let svg360 = fallback($$props["svg360"], "");
  $$payload.out += `<div class="svg-container-wrapper svelte-16bnsjc">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { svg1080, svg720, svg360 });
  pop();
}
function GraphicMultiples($$payload, $$props) {
  push();
  let svgPaths = fallback($$props["svgPaths"], () => [], true);
  let layoutClass = "";
  let svgs = [];
  const each_array = ensure_array_like(svgs);
  $$payload.out += `<div${attr_class(`svg-grid ${stringify(layoutClass)}`, "svelte-19pnj7a")}><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let svg = each_array[$$index];
    $$payload.out += `<div class="svg-box svelte-19pnj7a">${html(svg)}</div>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { svgPaths });
  pop();
}
function Footer($$payload) {
  $$payload.out += `<div class="footer svelte-baddse"><div class="footer-content svelte-baddse"><a href="https://schoolofcities.utoronto.ca/" target="_blank" class="logo-link"><img${attr("src", logos)} alt="University of Toronto and School of Cities logos" class="logos svelte-baddse"/></a></div></div>`;
}
function ScrollyImages($$payload, $$props) {
  push();
  let imageAlign = fallback($$props["imageAlign"], "center");
  let imageWidth = fallback($$props["imageWidth"], "100%");
  let imageHeight = fallback($$props["imageHeight"], "100%");
  let textSectionAlign = fallback($$props["textSectionAlign"], "right");
  let textSectionMaxWidth = fallback($$props["textSectionMaxWidth"], "500px");
  let fadeDuration = fallback($$props["fadeDuration"], 250);
  let sections = fallback(
    $$props["sections"],
    () => [
      {
        image: "/images/1.jpg",
        text: "<h2>Header</h2> <p>body text </p>"
      },
      {
        image: "/images/2.jpg",
        text: "<h2>Header</h2> <p>body text </p>"
      },
      {
        image: "/images/3.jpg",
        text: "<h2>Header</h2> <p>body text </p>"
      }
    ],
    true
  );
  let windowHeight = 0;
  let imgDivHeight = 0;
  let topImageMargin = "0px";
  let currentIndex = 0;
  {
    if (typeof imageHeight === "string") {
      if (imageHeight.includes("%") || imageHeight.includes("vh") || imageHeight.includes("dvh")) {
        const num = parseFloat(imageHeight);
        topImageMargin = `${(100 - num) / 2}dvh`;
      } else if (imageHeight.includes("px")) {
        const px = parseFloat(imageHeight);
        imgDivHeight = Math.max(0, (windowHeight - px) / 2);
        topImageMargin = `${imgDivHeight}px`;
      }
    }
  }
  console.log(imageHeight, windowHeight, topImageMargin);
  const each_array = ensure_array_like(sections);
  const each_array_1 = ensure_array_like(sections);
  $$payload.out += `<div class="scrolly-wrapper svelte-19q5mun"><div class="sticky-image svelte-19q5mun"><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let section = each_array[i];
    if (currentIndex === i) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="image-container"><img${attr_class(clsx(imageAlign), "svelte-19q5mun")}${attr("src", section.image)}${attr("alt", section.heading)} loading="lazy"${attr_style(`max-height: ${stringify(imageHeight)}; max-width: ${stringify(imageWidth)}; top: ${stringify(topImageMargin)};`)}/></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div> <!--[-->`;
  for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
    let section = each_array_1[i];
    $$payload.out += `<div${attr_class(`text-section ${stringify(textSectionAlign)}`, "svelte-19q5mun")}${attr_style(`max-width: ${stringify(textSectionMaxWidth)};`)}><div${attr_class(`text-wrapper ${stringify(section.text.trim() ? "" : "transparent")}`, "svelte-19q5mun")}>${html(section.text)}</div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, {
    imageAlign,
    imageWidth,
    imageHeight,
    textSectionAlign,
    textSectionMaxWidth,
    fadeDuration,
    sections
  });
  pop();
}
function Footnote($$payload, $$props) {
  push();
  let id = $$props["id"];
  let footnoteId = `footnote-${id[0]}`;
  let refId = `footnote-ref-${id[0]}`;
  id[1];
  $$payload.out += `<span class="footnote-ref-wrapper svelte-1x4veh"><a${attr("id", refId)}${attr("href", `#${footnoteId}`)} class="footnote-ref svelte-1x4veh"><span style="margin-left: -4px;"> [${escape_html(id[0])}]</span></a> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></span>`;
  bind_props($$props, { id });
  pop();
}
function Footnotes($$payload, $$props) {
  push();
  let footnotes = $$props["footnotes"];
  let footnoteListTitle = fallback($$props["footnoteListTitle"], "References");
  const each_array = ensure_array_like(footnotes);
  $$payload.out += `<div class="footnotes svelte-3bf4g"><h2 class="svelte-3bf4g">${escape_html(footnoteListTitle)}</h2> <!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let footnote = each_array[$$index];
    $$payload.out += `<div${attr("id", `footnote-${footnote.id}`)} class="footnote-item svelte-3bf4g"><sup class="svelte-3bf4g"><a${attr("href", `#footnote-ref-${footnote.id}`)} class="backlink svelte-3bf4g"><b>[${escape_html(footnote.id)}]</b></a></sup> <p style="display:inline" class="svelte-3bf4g">${html(footnote.text)}</p> <a${attr("href", `#footnote-ref-${footnote.id}`)} class="backlink svelte-3bf4g">⮝</a></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { footnotes, footnoteListTitle });
  pop();
}
function parseMarkdown(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(?!\*)(.+?)\*/g, "<em>$1</em>").replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
}
function createFootnoteStore() {
  let footnotes = [];
  function addFootnote(text) {
    const id = footnotes.length + 1;
    const parsed = parseMarkdown(text);
    footnotes.push({ id, text: parsed });
    return [id, parsed];
  }
  return {
    get footnotes() {
      return footnotes;
    },
    addFootnote
  };
}
function _page($$payload, $$props) {
  push();
  const scrollyContentBig = [
    {
      image: "https://schoolofcities.github.io/eddit/_app/immutable/assets/wood-buffalo-title-img-2.CpYjt7SE.jpg",
      text: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
    },
    {
      image: "https://jamaps.github.io/photos/picimgs/halifax2_2024.jpg",
      text: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
    },
    {
      image: "https://schoolofcities.github.io/eddit/_app/immutable/assets/worcester-title.DcKdv5q4.jpg",
      text: ""
      // empty text section to demonstrate transparent div
    },
    {
      image: "https://schoolofcities.github.io/eddit/_app/immutable/assets/worcester-title.DcKdv5q4.jpg",
      text: "<h2 style='margin-top: 20px;'>Header</h2> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
    }
  ];
  const scrollyContentSmall = [
    {
      image: "./examples/amroth-iso-lot.png",
      text: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
    },
    {
      image: "./examples/amroth-iso-bldg.png",
      text: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
    },
    {
      image: "./examples/wilson-iso-lot.svg",
      text: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
    },
    {
      image: "./examples/wilson-iso-bldg.svg",
      text: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
    }
  ];
  const footnoteStore = createFootnoteStore();
  const { footnotes, addFootnote } = footnoteStore;
  const fns = [
    "Hello I am a footnote",
    'Hello I am a second <a href="https://example.com" target="_blank">footnote</a> with a link',
    "Author (Year) Publication information etc this might be a citation or a reference to a source",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat lacus eu dolor dapibus sodales. Aenean venenatis metus id eleifend tincidunt. Nulla ut lacus et urna finibus bibendum sit amet et ante. Aliquam tristique, ex sed porttitor hendrerit, ex odio accumsan ex, eu maximus leo quam quis nulla."
  ];
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Design Components | School of Cities</title>`;
    $$payload2.out += `<meta name="description" content="Repository of design and web components for building data stories, visualizations, maps, and other custom web projects"/> <meta name="author" content="School of Cities"/> <meta rel="canonical" href="https://schoolofcities.github.io/eddit-east-bay/"/> <meta property="og:title" content="Design Components"/> <meta property="og:description" content="Repository of design and web components for building data stories, visualizations, maps, and other custom web projects"/> <meta property="og:type" content="website"/> <meta property="og:url" content="https://schoolofcities.github.io/eddit-east-bay/"/> <meta property="og:image" content="https://raw.githubusercontent.com/schoolofcities/eddit-east-bay/main/static/web-card.png"/> <meta property="og:locale" content="en_CA"/> <meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:title" content="Design Components"/> <meta name="twitter:description" content="Repository of design and web components for building data stories, visualizations, maps, and other custom web projects"/> <meta name="twitter:site" content="https://schoolofcities.github.io/eddit-east-bay/"/> <meta name="twitter:image" content="https://raw.githubusercontent.com/schoolofcities/eddit-east-bay/main/static/web-card.png"/> <meta name="citation_title" content="Design Components"/> <meta name="citation_author" content="Author Name 1"/> <meta name="citation_author" content="Author Name 2"/> <meta name="citation_publication_date" content="2025/09/23"/> <meta name="citation_journal_title" content="School of Cities"/> <meta name="citation_abstract_html_url" content="https://schoolofcities.github.io/eddit-east-bay/"/>`;
  });
  $$payload.out += `<main>`;
  LogoTop($$payload, { logoType: "Blue", backgroundColor: "var(--brandWhite)" });
  $$payload.out += `<!----> `;
  ImageSingle($$payload, {
    imageURL: "https://jamaps.github.io/photos/picimgs/taipei1_2025.jpg",
    caption: "Taipei skyline.",
    source: "Jeff Allen.",
    altText: "",
    maxWidth: "1080px"
  });
  $$payload.out += `<!----> `;
  TitleStandard($$payload, {
    title: "Fun Captivating Project Title",
    subtitle: "Maybe a slightly longer more detailed wordier project subtitle "
  });
  $$payload.out += `<!----> <div class="text">`;
  AuthorDate($$payload, {
    authors: "<a href='' target='_blank'>Author Name</a> & <a href='' target='_blank'>Author Name</a>",
    date: "July 2025"
  });
  $$payload.out += `<!----> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat lacus eu dolor dapibus sodales. Aenean venenatis metus id eleifend tincidunt. Nulla ut lacus et urna finibus bibendum sit amet et ante. Aliquam tristique, ex sed porttitor hendrerit, ex odio accumsan ex, eu maximus leo quam quis nulla.</p> <p>Cras tincidunt nisi non tempus suscipit. Nullam metus erat, ultrices vitae mauris commodo, placerat sollicitudin sem. In vitae dignissim eros. Phasellus porttitor orci.`;
  Footnote($$payload, { id: addFootnote(fns[0]) });
  $$payload.out += `<!----> nisl, vitae iaculis nulla pretium et. Fusce nec tortor erat. Vestibulum pretium nisl et ligula ultrices fringilla.</p> <p>Vivamus non finibus erat. Ut quis mi at felis aliquam rhoncus eu eget augue. Nunc convallis, dui et congue suscipit, nisl sapien malesuada ligula, vitae luctus justo ligula finibus diam. Quisque aliquam et lacus vitae venenatis. Duis id vulputate augue, vel posuere ex. Nam fermentum consequat dolor, ac finibus justo finibus sit amet. Nam suscipit egestas tellus, malesuada dignissim neque dignissim sed.`;
  Footnote($$payload, { id: addFootnote(fns[1]) });
  $$payload.out += `<!----></p> <p>Nunc vel massa turpis. Vivamus id odio ut nulla dignissim molestie.</p></div> `;
  GraphicSingle($$payload, {
    svg720: "./examples/map-tree-redline-720.svg",
    svg360: "./examples/map-tree-redline-360.svg"
  });
  $$payload.out += `<!----> <div class="text"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat lacus eu dolor dapibus sodales. Aenean venenatis metus id eleifend tincidunt. Nulla ut lacus et urna finibus bibendum sit amet et ante. Aliquam tristique, ex sed porttitor hendrerit, ex odio accumsan ex, eu maximus leo quam quis nulla.`;
  Footnote($$payload, { id: addFootnote(fns[2]) });
  $$payload.out += `<!----></p> <p>Cras tincidunt nisi non tempus suscipit. Nullam metus erat, ultrices vitae mauris commodo, placerat sollicitudin sem. In vitae dignissim eros. Phasellus porttitor orci nisl, vitae iaculis nulla pretium et. Fusce nec tortor erat. Vestibulum pretium nisl et ligula ultrices fringilla.`;
  Footnote($$payload, { id: addFootnote(fns[3]) });
  $$payload.out += `<!----></p> <p>Vivamus non finibus erat. Ut quis mi at felis aliquam rhoncus eu eget augue. Nunc convallis, dui et congue suscipit, nisl sapien malesuada ligula, vitae luctus justo ligula finibus diam. Quisque aliquam et lacus vitae venenatis. Duis id vulputate augue, vel posuere ex. Nam fermentum consequat dolor, ac finibus justo finibus sit amet. Nam suscipit egestas tellus, malesuada dignissim neque dignissim sed.`;
  Footnote($$payload, { id: addFootnote(fns[0]) });
  $$payload.out += `<!----></p> <p>Nunc vel massa turpis. Vivamus id odio ut nulla dignissim molestie.</p></div> `;
  GraphicMultiples($$payload, {
    svgPaths: [
      "./examples/map-tree-360.svg",
      "./examples/map-heat-360.svg",
      "./examples/map-asthma-360.svg"
    ]
  });
  $$payload.out += `<!----> <div class="text"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat lacus eu dolor dapibus sodales. Aenean venenatis metus id eleifend tincidunt. Nulla ut lacus et urna finibus bibendum sit amet et ante. Aliquam tristique, ex sed porttitor hendrerit, ex odio accumsan ex, eu maximus leo quam quis nulla.`;
  Footnote($$payload, { id: addFootnote(fns[2]) });
  $$payload.out += `<!----></p> <p>Cras tincidunt nisi non tempus suscipit. Nullam metus erat, ultrices vitae mauris commodo, placerat sollicitudin sem. In vitae dignissim eros. Phasellus porttitor orci nisl, vitae iaculis nulla pretium et. Fusce nec tortor erat. Vestibulum pretium nisl et ligula ultrices fringilla.`;
  Footnote($$payload, { id: addFootnote(fns[3]) });
  $$payload.out += `<!----></p> <p>Vivamus non finibus erat. Ut quis mi at felis aliquam rhoncus eu eget augue. Nunc convallis, dui et congue suscipit, nisl sapien malesuada ligula, vitae luctus justo ligula finibus diam. Quisque aliquam et lacus vitae venenatis. Duis id vulputate augue, vel posuere ex. Nam fermentum consequat dolor, ac finibus justo finibus sit amet. Nam suscipit egestas tellus, malesuada dignissim neque dignissim sed.`;
  Footnote($$payload, { id: addFootnote(fns[0]) });
  $$payload.out += `<!----></p> <p>Nunc vel massa turpis. Vivamus id odio ut nulla dignissim molestie.</p></div> `;
  ScrollyImages($$payload, {
    sections: scrollyContentSmall,
    imageAlign: "center",
    imageWidth: "540px",
    imageHeight: "540px",
    textSectionMaxWidth: "540px",
    textSectionAlign: "right",
    fadeDuration: 500
  });
  $$payload.out += `<!----> <div class="text"><p>Fusce sed sem nulla. Praesent congue sapien pellentesque sodales fermentum. Pellentesque dapibus ultrices lacus consectetur laoreet. Integer imperdiet sed sapien sed pharetra. Praesent sodales nunc ut lorem venenatis laoreet vitae et neque. Etiam condimentum tincidunt dignissim.</p> <p>Praesent placerat purus vitae rhoncus auctor. Aliquam faucibus porta scelerisque. In bibendum ornare sagittis. Nam accumsan turpis sit amet elementum sollicitudin. Mauris auctor nec velit id iaculis. Proin venenatis nisl a iaculis dignissim. Nunc volutpat nulla at dolor mollis eleifend. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam commodo purus in risus placerat, sed vehicula enim viverra.</p> <h2>A subheading that is nice</h2> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat lacus eu dolor dapibus sodales. Aenean venenatis metus id eleifend tincidunt. Nulla ut lacus et urna finibus bibendum sit amet et ante. Aliquam tristique, ex sed porttitor hendrerit, ex odio accumsan ex, eu maximus leo quam quis nulla.</p> <p>Cras tincidunt nisi non tempus suscipit. Nullam metus erat, ultrices vitae mauris commodo, placerat sollicitudin sem. In vitae dignissim eros. Phasellus porttitor orci nisl, vitae iaculis nulla pretium et. Fusce nec tortor erat. Vestibulum pretium nisl et ligula ultrices fringilla.</p> <p>Vivamus non finibus erat. Ut quis mi at felis aliquam rhoncus eu eget augue. Nunc convallis, dui et congue suscipit, nisl sapien malesuada ligula, vitae luctus justo ligula finibus diam. Quisque aliquam et lacus vitae venenatis. Duis id vulputate augue, vel posuere ex. Nam fermentum consequat dolor, ac finibus justo finibus sit amet. Nam suscipit egestas tellus, malesuada dignissim neque dignissim sed.</p> <h3>A subheading that is nice</h3> <p>Cras tincidunt nisi non tempus suscipit. Nullam metus erat, ultrices vitae mauris commodo, placerat sollicitudin sem. In vitae dignissim eros. Phasellus porttitor orci nisl, vitae iaculis nulla pretium et. Fusce nec tortor erat. Vestibulum pretium nisl et ligula ultrices fringilla.</p> <p>Vivamus non finibus erat. Ut quis mi at felis aliquam rhoncus eu eget augue. Nunc convallis, dui et congue suscipit, nisl sapien malesuada ligula, vitae luctus justo ligula finibus diam. Quisque aliquam et lacus vitae venenatis. Duis id vulputate augue, vel posuere ex. Nam fermentum consequat dolor, ac finibus justo finibus sit amet. Nam suscipit egestas tellus, malesuada dignissim neque dignissim sed.</p></div> `;
  ScrollyImages($$payload, {
    sections: scrollyContentBig,
    imageAlign: "center",
    imageWidth: "100%",
    imageHeight: "100dvh",
    textSectionMaxWidth: "720px",
    textSectionAlign: "left",
    fadeDuration: 500
  });
  $$payload.out += `<!----> <div class="text"><p>Fusce sed sem nulla. Praesent congue sapien pellentesque sodales fermentum. Pellentesque dapibus ultrices lacus consectetur laoreet. Integer imperdiet sed sapien sed pharetra. Praesent sodales nunc ut lorem venenatis laoreet vitae et neque. Etiam condimentum tincidunt dignissim.</p> <p>Praesent placerat purus vitae rhoncus auctor. Aliquam faucibus porta scelerisque. In bibendum ornare sagittis. Nam accumsan turpis sit amet elementum sollicitudin. Mauris auctor nec velit id iaculis. Proin venenatis nisl a iaculis dignissim. Nunc volutpat nulla at dolor mollis eleifend. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam commodo purus in risus placerat, sed vehicula enim viverra.</p> <h2>A subheading that is nice</h2> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat lacus eu dolor dapibus sodales. Aenean venenatis metus id eleifend tincidunt. Nulla ut lacus et urna finibus bibendum sit amet et ante. Aliquam tristique, ex sed porttitor hendrerit, ex odio accumsan ex, eu maximus leo quam quis nulla.</p> <p>Cras tincidunt nisi non tempus suscipit. Nullam metus erat, ultrices vitae mauris commodo, placerat sollicitudin sem. In vitae dignissim eros. Phasellus porttitor orci nisl, vitae iaculis nulla pretium et. Fusce nec tortor erat. Vestibulum pretium nisl et ligula ultrices fringilla.</p> <p>Vivamus non finibus erat. Ut quis mi at felis aliquam rhoncus eu eget augue. Nunc convallis, dui et congue suscipit, nisl sapien malesuada ligula, vitae luctus justo ligula finibus diam. Quisque aliquam et lacus vitae venenatis. Duis id vulputate augue, vel posuere ex. Nam fermentum consequat dolor, ac finibus justo finibus sit amet. Nam suscipit egestas tellus, malesuada dignissim neque dignissim sed.</p> <h3>A subheading that is nice</h3> <p>Cras tincidunt nisi non tempus suscipit. Nullam metus erat, ultrices vitae mauris commodo, placerat sollicitudin sem. In vitae dignissim eros. Phasellus porttitor orci nisl, vitae iaculis nulla pretium et. Fusce nec tortor erat. Vestibulum pretium nisl et ligula ultrices fringilla.</p> <p>Vivamus non finibus erat. Ut quis mi at felis aliquam rhoncus eu eget augue. Nunc convallis, dui et congue suscipit, nisl sapien malesuada ligula, vitae luctus justo ligula finibus diam. Quisque aliquam et lacus vitae venenatis. Duis id vulputate augue, vel posuere ex. Nam fermentum consequat dolor, ac finibus justo finibus sit amet. Nam suscipit egestas tellus, malesuada dignissim neque dignissim sed.</p> <div class="details"><h2>Data &amp; Methodology</h2> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat lacus eu dolor dapibus sodales. Aenean venenatis metus id eleifend tincidunt. Nulla ut lacus et urna finibus bibendum sit amet et ante. Aliquam tristique, ex sed porttitor hendrerit, ex odio accumsan ex, eu maximus leo quam quis nulla.</p> <p>Cras tincidunt nisi non tempus suscipit. Nullam metus erat, ultrices vitae mauris commodo, placerat sollicitudin sem. In vitae dignissim eros. Phasellus porttitor orci nisl, vitae iaculis nulla pretium et. Fusce nec tortor erat. Vestibulum pretium nisl et ligula ultrices fringilla.</p> <p>Vivamus non finibus erat. Ut quis mi at felis aliquam rhoncus eu eget augue. Nunc convallis, dui et congue suscipit, nisl sapien malesuada ligula, vitae luctus justo ligula finibus diam. Quisque aliquam et lacus vitae venenatis. Duis id vulputate augue, vel posuere ex. Nam fermentum consequat dolor, ac finibus justo finibus sit amet. Nam suscipit egestas tellus, malesuada dignissim neque dignissim sed.</p></div></div> <div class="text">`;
  Footnotes($$payload, { footnotes });
  $$payload.out += `<!----></div> `;
  Footer($$payload);
  $$payload.out += `<!----></main>`;
  pop();
}
export {
  _page as default
};
