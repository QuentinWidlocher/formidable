import type { Form } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  forms: Form[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const forms = await prisma.form.findMany({
    where: {
      userId
    }
  });

  return json<LoaderData>({forms});
}

export default function WebsiteList() {
  const data = useLoaderData() as LoaderData;

  return (
    <section className="card w-96 bg-base-200 my-5 shadow-xl mx-auto">
  <div className="card-body">
    <h2 className="card-title mb-5">Your forms</h2>
    <ul className="menu bg-base-100 rounded-box p-2">
      {data.forms.map(form => (
        <li key={form.slug}>
          <Link to={`/${form.slug}/messages`} className="flex flex-col items-start">
            <span>{form.name}</span>
            <span className="opacity-60 -mt-4">https://{form.domain}/</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
  </section>
  )
}