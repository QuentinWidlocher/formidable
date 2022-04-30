import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="">
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Formidable</h1>
            <p className="py-6">Just add one drop of <strong>Formidable</strong> to your website and get a contact form just like that !</p>
            {user ? (
              <Link
                to="/forms"
                prefetch="render"
                className="btn btn-primary"
              >
                See your forms
              </Link>
            ) : (
              <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 gap-5 sm:space-y-0">
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
    </main>
  );
}
