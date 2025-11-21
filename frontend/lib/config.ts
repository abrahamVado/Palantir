//1.- Capture the backend origin from environment variables to avoid hard-coding hosts.
const rawBackendOrigin =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  "https://api.softwaremia.com";

//2.- Normalize the backend origin so request builders can safely concatenate paths.
const backendOrigin = rawBackendOrigin.replace(/\/+$/, "");

export const appConfig = {
  //3.- Expose the normalized backend origin for both server and client callers.
  backendOrigin,
  //4.- Centralize the human-friendly app title for reuse in metadata and headers.
  appName: "Larago Admin Portal",
};
