import { LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { BubbleUpload } from "iconoir-react";
import { useEffect } from "react";
import FormCodeExample from "~/components/form-code-example";

import { useOptionalUser } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  let url = new URL(request.url)
  console.debug('url.searchParams', url.searchParams)
  let formSent = url.searchParams.get("formSent") ?? false;

  return { formSent };
}

export default function Index() {
  const user = useOptionalUser();
  const { formSent } = useLoaderData();

  useEffect(() => {
    const successMessage = document.querySelector('#success-message')
    if (successMessage && formSent) {
      successMessage.scrollIntoView({ behavior: 'smooth' });
    }
  }, [formSent]);

  return (
    <main>
      <div className="hero min-h-screen -my-28 bg-base-200 shadow-md">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="flex w-full justify-center font-bold text-primary space-x-5">
              <BubbleUpload className="text-3xl" />
              <h1 className="text-5xl">Formidable</h1>
            </div>
            <p className="py-6 text-lg">Just add one drop of <strong>Formidable</strong> to your website and get a contact form just like that !</p>
            {user ? (
              <Link
                to="/forms"
                prefetch="render"
                className="btn btn-primary"
              >
                See your forms
              </Link>
            ) : (
              <div className="mx-auto space-x-4">
                <Link
                  to="/join"
                  prefetch="intent"
                  className="btn btn-primary"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  prefetch="intent"
                  className="btn btn-primary btn-outline"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto card bg-base-100">
        <div className="card-body">
          <section className="p-5 flex gap-5 flex-col lg:flex-row">
            <div className="w-full">
              <div className="m-10 md:m-5 lg:m-10">
                <h2 className="font-bold text-2xl text-primary">It's as simple as a HTML Form</h2>
                <p className="my-5">
                  You just need to provide the url we'll give you, add the right inputs in your form and tada 🎉 <br /><br />
                  Here are the inputs you can add (feel free to add client-side validation with HTML attributes):
                </p>
                <ol className="list-disc space-y-2">
                  <li><code>from</code> : So you can know who's sending you a message</li>
                  <li><code>object</code> : So you can know what people constact you about</li>
                  <li><code>content</code> : This one is actually required, you can put it inside a <code>{'<textarea>'}.</code></li>
                </ol>
              </div>
            </div>
            <div className="w-full">
              <FormCodeExample formSlug="formidable-site" />
            </div>
          </section>
          <div className="divider"></div>
          <section className="p-5">
            {formSent ? (
              <span id="success-message" className="text-primary text-center mx-auto w-full text-xl">Your message has been sent to Formidable, create an account to see how messages you receive can be read.</span>)
              : (
                <form action="https://formidable.site/formidablesite-contact" className="flex gap-5 flex-col mx-auto lg:w-96">
                  <h2 className="font-bold text-2xl text-primary">Send us a message to see it in action</h2>
                  <p>It's pretty much the same code as the example above, you can check in the dev tools!</p>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">What is your email ?</span>
                    </label>
                    <input name="from" type="email" placeholder="email@example.com" className="input input-bordered w-full" />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">What is your message about ?</span>
                    </label>
                    <input name="object" type="text" placeholder="About..." className="input input-bordered w-full" />
                  </div>

                  <textarea className="textarea textarea-bordered" name="content" rows={7} required></textarea>

                  <button type="submit" className="btn btn-primary">Send your message to Formidable</button>

                </form>
              )}
          </section>
        </div>
      </div>
    </main>
  );
}
