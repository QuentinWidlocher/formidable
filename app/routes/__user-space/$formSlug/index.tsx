import type { ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.formSlug, "formSlug not found");

  const formData = await request.formData();
  const content = formData.get("content")?.toString();
  const object = formData.get("object")?.toString();
  const from = formData.get("from")?.toString();

  invariant(content, "content not found");

  return prisma.message.create({
    data: {
      content,
      object,
      from,
      formSlug: params.formSlug,
    }
  });
}