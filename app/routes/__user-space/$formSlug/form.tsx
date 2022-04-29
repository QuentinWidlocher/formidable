import type { ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { getUserByEmail } from "~/user.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.formSlug, "formSlug not found");

  const rawFormData = await request.formData();
  const formData = Object.fromEntries(rawFormData.entries())

  const user = await getUserByEmail(formData.formidableUser?.toString())

  invariant(user, "user not found");

  return prisma.message.create({
    data: {
      content: formData.content.toString(),
      object: formData.object.toString(),
      from: formData.from.toString(),
      formSlug: params.formSlug,
    }
  });
}