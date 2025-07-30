import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HULU GENERAL COMMISSION",
    short_name: "HULU",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
  icons: [
  {
    src: "/manifest-icon-192.maskable.png",
    sizes: "192x192",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/manifest-icon-192.maskable.png",
    sizes: "192x192",
    type: "image/png",
    purpose: "maskable",
  },
  {
    src: "/manifest-icon-512.maskable.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/manifest-icon-512.maskable.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  }
],


  };
}
