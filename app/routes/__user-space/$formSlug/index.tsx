import { ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.formSlug, "formSlug not found");

  console.debug('request.headers', request.headers)

  let content: string | undefined;
  let object: string | undefined;
  let from: string | undefined;

  if (request.method === "POST") {
    const formData = await request.formData();
    content = formData.get("content")?.toString();
    object = formData.get("object")?.toString();
    from = formData.get("from")?.toString();
  } else if (request.method === "GET") {
    const searchParams = new URL(request.url).searchParams;
    content = searchParams.get("content")?.toString();
    object = searchParams.get("object")?.toString();
    from = searchParams.get("from")?.toString();
  }

  invariant(content, "content not found");

  await prisma.message.create({
    data: {
      content,
      object,
      from,
      formSlug: params.formSlug,
    }
  });

  return new Response(null, {
    status: 303,
    headers: {
      Location: request.headers.get("referer") ?? request.headers.get("origin") ?? "/",
    },
  });
}