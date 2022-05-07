import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import Alert from "@reach/alert";
import { Form, Link, useActionData } from "@remix-run/react";
import { useRef, useEffect } from "react";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";
import { slugify } from "~/utils/string.utils";

type ActionData = {
  errors?: {
    name?: string;
    domain?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const domain = formData.get("domain");

  if (typeof name !== "string" || name.length === 0) {
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }

  if (typeof domain !== "string" || domain.length === 0) {
    return json<ActionData>(
      { errors: { domain: "Domain is required" } },
      { status: 400 }
    );
  }

  let slugToBe = slugify(domain + ' ' + name);

  const existingSlugCount = await prisma.form.count({
    where: {
      slug: slugToBe
    }
  });

  if (existingSlugCount > 0) {
    slugToBe = slugToBe + '-' + (existingSlugCount + 1);
  }

  const form = await prisma.form.create({
    data: {
      domain,
      name,
      slug: slugToBe,
      userId,
    }
  });


  return redirect(`/${form.slug}/details`);
};

export default function NewNotePage() {
  const actionData = useActionData() as ActionData;

  const nameRef = useRef<HTMLInputElement>(null);
  const domainRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.domain) {
      domainRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="py-5 lg:py-10">
      <section className="card w-full sm:w-96 bg-base-200 shadow-xl mx-auto">
        <div className="card-body">
          <h2 className="card-title">Create a form</h2>
          <Form className="flex h-full flex-col" method="post">
            <input type="hidden" name="id" />
            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text">
                  Your form name
                </span>
              </label>
              <input
                ref={nameRef}
                name="name"
                placeholder="Contact, Newsletter, etc."
                className="input input-bordered"
                aria-invalid={actionData?.errors?.name ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.name ? "name-error" : undefined
                }
              />
              <label htmlFor="name" className="label">
                {actionData?.errors?.name && (
                  <Alert className="label-text-alt text-error" id="name=error">
                    {actionData.errors.name}
                  </Alert>
                )}
              </label>
            </div>

            <div className="form-control flex-1">
              <label htmlFor="domain" className="label">
                <span className="label-text">
                  You website's domain
                </span>
              </label>
              <input
                ref={domainRef}
                name="domain"
                placeholder="example.com"
                className="input input-bordered"
                aria-invalid={actionData?.errors?.domain ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.domain ? "domain-error" : undefined
                }
              />
              <label htmlFor="body" className="label">
                {actionData?.errors?.domain && (
                  <Alert className="label-text-alt text-error" id="domain=error">
                    {actionData.errors.domain}
                  </Alert>
                )}
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <Link to="/forms" className="btn btn-ghost">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary">
                Create the form
              </button>
            </div>
          </Form>
        </div>
      </section>
    </div>
  );
}
