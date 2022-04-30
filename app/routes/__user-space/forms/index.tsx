import type { Form } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  formsByDomain: Record<string, Form[]>;
  noForms: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const forms = await prisma.form.findMany({
    where: {
      userId
    }
  });

  let formsByDomain = forms.reduce((acc, form) => {
    acc[form.domain] = [...(acc[form.domain] ?? []), form];
    return acc;
  }, {} as Record<string, Form[]>);

  return json<LoaderData>({
    formsByDomain,
    noForms: forms.length <= 0
  });
}

export default function WebsiteList() {
  const data = useLoaderData() as LoaderData;

  return (
    <div className="py-5 lg:py-10">
      <section className="card w-full sm:w-96 bg-base-200 shadow-xl mx-auto">
        <div className="card-body">
          <h2 className="card-title">Your forms</h2>
          {data.noForms ? (
            <Link to="new" className="btn btn-outline mt-5">Create your first form</Link>
          ) : (
            <>
              <ul className="menu bg-base-100 rounded-box p-2 my-5">
                {Object.keys(data.formsByDomain).map(formDomain => (
                  <>
                    <li className="menu-title mt-2">
                      <span>{formDomain}</span>
                    </li>
                    {data.formsByDomain[formDomain].map(form => (
                      <li key={form.slug}>
                        <Link to={`/${form.slug}/messages`}>
                          {form.name}
                        </Link>
                      </li>
                    ))}
                  </>
                ))}
              </ul>
              <Link to="new" className="btn btn-outline">Add another one</Link>
            </>
          )}
        </div>
      </section>
    </div>
  )
}