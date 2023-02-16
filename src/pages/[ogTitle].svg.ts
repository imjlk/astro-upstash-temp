import type { APIRoute } from "astro";
import generateOgImage from "../utilities/generateOgImage";

export const get: APIRoute = async ({ params, request }) => {
  const ogTitle = params.ogTitle ?? "Hello World";
  console.log(ogTitle);
  return {
    body: await generateOgImage(ogTitle),
  };
};
