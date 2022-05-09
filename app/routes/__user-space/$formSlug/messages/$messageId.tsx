import type { Message } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  message: Pick<Message, "content" | "object" | "from">;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.formSlug, "formSlug not found");
  invariant(params.messageId, "messageId not found");

  const message = await prisma.message.findUnique({
    where: {
      id: params.messageId,
    },
    select: {
      id: true,
      object: true,
      content: true,
      from: true,
      readAt: true,
    },
  });

  if (!message) {
    return redirect(`/${params.formSlug}/messages`);
  }

  if (message.readAt == null) {
    await prisma.message.update({
      where: {
        id: message.id,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  return json<LoaderData>({ message });
};

export const action: ActionFunction = async ({ request, params }) => {
  await requireUserId(request);
  invariant(params.messageId, "messageId not found");

  await prisma.message.delete({
    where: {
      id: params.messageId,
    },
  });

  return redirect(".");
};

export default function NoteDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div className="card mx-auto w-full bg-base-200 shadow-xl md:w-1/2">
      <div className="card-body">
        <h2 className="card-title">{data.message.object}</h2>
        <h3 className="underline-offset-2 opacity-60 hover:underline">
          From <a href={`mailto:${data.message.from}`}>{data.message.from}</a>
        </h3>
        <p className="my-5">{data.message.content}</p>
        <div className="card-actions justify-end">
          <form method="post">
            <button className="btn btn-outline btn-error btn-sm">
              Delete Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}
