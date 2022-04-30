import type { Form } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form as HtmlForm, Link } from "@remix-run/react";
import { ArrowLeft } from "iconoir-react";
import { useState } from "react";
import invariant from "tiny-invariant";
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

  function askForConfirmation() {
    setConfirmDelete(true);
    setTimeout(() => setConfirmDelete(false), 2500);
  }

  return (
    <div className="py-5 lg:py-10">
      <section className="card w-full sm:w-96 bg-base-200 shadow-xl mx-auto overflow-visible">
        <div className="card-body">
          <Link to="/forms" className="btn btn-ghost w-full gap-2">
            <ArrowLeft />
            <span>Back to your forms</span>
          </Link>
          <h2 className="card-title mt-5">{data.form.name}</h2>
          <h3 className="opacity-60">{data.form.domain}</h3>

          <p className="my-5">
            <span>Add a form like this to your website.</span><br /><br />
            <span>You can style it however you want, plug any script you need or whatever, as long as  you use the right field names and put the right <code>action</code> in the form.</span>
          </p>

          <div className="mockup-code sm:-mx-20 lg:-mx-52 sm:shadow-md">
            <pre data-prefix=" 1"><code>{'<'}<span className="text-red-400">form</span> <span className="text-orange-300">action</span>=<span className="text-green-300">"https://formidable.site/<em>{data.form.slug}</em>"</span> <span className="text-orange-300">method</span>=<span className="text-green-300">"post"</span>{'>'}</code></pre>
            <pre data-prefix=" 2"><code>{'\t<'}<span className="text-red-400">div</span>{'>'}</code></pre>
            <pre data-prefix=" 3"><code>{'\t\t<'}<span className="text-red-400">label</span> <span className="text-orange-300">for</span>=<span className="text-green-300">"from"</span>{'>'}Your email{'</'}<span className="text-red-400">label</span>{'>'}</code></pre>
            <pre data-prefix=" 4"><code>{'\t\t<'}<span className="text-red-400">input</span> <span className="text-orange-300">name</span>=<span className="text-green-300">"from"</span> <span className="text-orange-300">type</span>=<span className="text-green-300">"email"</span>{'/>'}</code></pre>
            <pre data-prefix=" 5"><code>{'\t</'}<span className="text-red-400">div</span>{'>'}</code></pre>
            <pre data-prefix=" 6"></pre>
            <pre data-prefix=" 7"><code>{'\t<'}<span className="text-red-400">div</span>{'>'}</code></pre>
            <pre data-prefix=" 8"><code>{'\t\t<'}<span className="text-red-400">label</span> <span className="text-orange-300">for</span>=<span className="text-green-300">"object"</span>{'>'}What's this about ?{'</'}<span className="text-red-400">label</span>{'>'}</code></pre>
            <pre data-prefix=" 9"><code>{'\t\t<'}<span className="text-red-400">input</span> <span className="text-orange-300">name</span>=<span className="text-green-300">"object"</span> <span className="text-orange-300">type</span>=<span className="text-green-300">"text"</span>{'/>'}</code></pre>
            <pre data-prefix="10"><code>{'\t</'}<span className="text-red-400">div</span>{'>'}</code></pre>
            <pre data-prefix="11"></pre>
            <pre data-prefix="12"><code>{'\t<'}<span className="text-red-400">div</span>{'>'}</code></pre>
            <pre data-prefix="13"><code>{'\t\t<'}<span className="text-red-400">label</span> <span className="text-orange-300">for</span>=<span className="text-green-300">"content"</span>{'>'}Your message{'</'}<span className="text-red-400">label</span>{'>'}</code></pre>
            <pre data-prefix="14"><code>{'\t\t<'}<span className="text-red-400">textarea</span> <span className="text-orange-300">name</span>=<span className="text-green-300">"content"</span>{'/>'}</code></pre>
            <pre data-prefix="15"><code>{'\t</'}<span className="text-red-400">div</span>{'>'}</code></pre>
            <pre data-prefix="16"><code>{'</'}<span className="text-red-400">form</span>{'>'}</code></pre>
          </div>

          <p className="my-5">
            <span>Only the content is required on Formidable, but you can add rules on your side of course.</span><br /><br />
            <span>On a successful submit, the user will be redirected on the page they came from (by default, but you can provide a <code>redirect</code> input to redirect elsewhere) with <code>?formSent=true</code> in the query params.</span><br /><br />
            <span>If the server encounters an error, you will be redirected with <code>?formSent=false&error=someField</code> where <code>someField</code> is the first field that's invalid.</span>
          </p>

          <div className="divider"></div>
          <HtmlForm method="post">
            <button
              className={`btn btn-block ${confirmDelete ? 'btn-error' : 'btn-ghost'}`}
              onClick={() => askForConfirmation()}
              type={confirmDelete ? 'submit' : 'button'}>
              {confirmDelete ? 'Click again to confirm' : 'Delete this form'}
            </button>
          </HtmlForm>
        </div>
      </section>
    </div>
  )
}