const siteUrl = "https://www.sachinlavatenagarsevak.com";

export default function sitemap() {
  const routes = [
    "/",
    "/about",
    "/works",
    "/gallery",
    "/services",
    "/complaints",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
