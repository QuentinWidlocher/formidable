import type { ActionFunction, DataFunctionArgs, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/db.server";

async function createMessage(params: DataFunctionArgs['params'], request: Request, { content, object, from }: {
  content?: string,
  object?: string,
  from?: string,
}): Promise<Response> {
  if (!params.formSlug) {
    return new Response("Formidable : this form does not exists", { status: 400 });
  }

  const returnUrl = request.headers.get("referer") ?? request.headers.get("origin");

  if (!returnUrl) {
    return new Response("Formidable : You cannot use this form if your browser block the 'referer' data. If you're in private browsing, try without.", { status: 400 });
  }

  if (!content) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: returnUrl + '?formSent=false&error=content',
      }
    });
  }

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
      Location: returnUrl + '?formSent=true',
    },
  });
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const content = formData.get("content")?.toString();
  const object = formData.get("object")?.toString();
  const from = formData.get("from")?.toString();

  return createMessage(params, request, { content, object, from });
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const searchParams = new URL(request.url).searchParams;
  const content = searchParams.get("content")?.toString();
  const object = searchParams.get("object")?.toString();
  const from = searchParams.get("from")?.toString();

  return createMessage(params, request, { content, object, from });
}