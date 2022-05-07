import type { Form } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form as HtmlForm, Link, useLoaderData } from "@remix-run/react";
import { ArrowLeft, MessageText } from "iconoir-react";
import type { FormEvent } from "react";
import { useState } from "react";
import invariant from "tiny-invariant";
import FormCodeExample from "~/components/form-code-example";
import { prisma } from "~/db.server";

type LoaderData = {
  form: Form;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.formSlug, "formSlug not found");

  const form = await prisma.form.findUnique({
    where: {
      slug: params.formSlug,
    },
    include: {
      messages: true,
    }
  })

  if (!form) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ form });
}

export const action: ActionFunction = async ({ params }) => {
  invariant(params.formSlug, "formSlug not found");

  await prisma.form.delete({
    where: {
      slug: params.formSlug,
    }
  });

  return redirect('/forms');
}

export default function FormEdition() {
  const data = useLoaderData() as LoaderData;
  const [confirmDelete, setConfirmDelete] = useState(false);

  function askForConfirmation(event: FormEvent) {
    if (!confirmDelete) {
      event.preventDefault();
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2500);
    }
  }

  return (
    <div className="py-5 lg:py-10">
      <section className="card w-full sm:w-96 bg-base-200 shadow-xl mx-auto overflow-visible">
        <div className="card-body">
          <Link to="/forms" className="btn btn-ghost w-full gap-2">
            <ArrowLeft />
            <span>Back to your forms</span>
          </Link>
          <Link to={`/${data.form.slug}/messages`} className="btn btn-ghost w-full gap-2">
            <MessageText />
            <span>See the messages</span>
          </Link>
          <h2 className="card-title mt-5">{data.form.name}</h2>
          <h3 className="opacity-60">{data.form.domain}</h3>

          <p className="my-5">
            <span>Add a form like this to your website.</span><br /><br />
            <span>You can style it however you want, plug any script you need or whatever, as long as  you use the right field names and put the right <code>action</code> in the form.</span>
          </p>

          <FormCodeExample formSlug={data.form.slug} className="sm:-mx-20 lg:-mx-52" />

          <p className="my-5">
            <span>Only the content is required on Formidable, but you can add rules on your side of course.</span><br /><br />
            <span>On a successful submit, the user will be redirected on the page they came from (by default, but you can provide a <code>redirect</code> input to redirect elsewhere) with <code>?formSent=true</code> in the query params.</span><br /><br />
            <span>If the server encounters an error, you will be redirected with <code>?formSent=false&error=someField</code> where <code>someField</code> is the first field that's invalid.</span>
          </p>

          <div className="divider"></div>
          <HtmlForm method="post" onSubmit={askForConfirmation}>
            <button
              className={`btn btn-block ${confirmDelete ? 'btn-error' : 'btn-ghost'}`}>
              {confirmDelete ? 'Click again to confirm' : 'Delete this form'}
            </button>
          </HtmlForm>
        </div>
      </section>
    </div>
  )
}