import type { Form, Message } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Menu, PageEdit } from "iconoir-react";
import { useRef } from "react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

type LoaderData = {
  form: Form & { messages: Message[] };
};

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
};

export default function NoteDetailsPage() {
  const data = useLoaderData() as LoaderData;
  const appDrawerToggleRef = useRef<HTMLLabelElement | null>(null);

  return (
    <div className="drawer-mobile drawer w-full flex-1">
      <input
        id="app-drawer"
        type="checkbox"
        className="drawer-toggle"
      ></input>
      <div className="drawer-content">
        <main className="h-full p-5 lg:py-10">
          <label
            ref={appDrawerToggleRef}
            htmlFor="app-drawer"
            className="btn btn-ghost btn-block gap-2 mb-5 lg:hidden"
          >
            <Menu /> <span>See the messages</span>
          </label>
          <Outlet />
        </main>
      </div>

      <div className="drawer-side">
        <label htmlFor="app-drawer" className="drawer-overlay"></label>
        <div className="w-80 bg-base-200 p-2 lg:w-96">
          <div className="flex h-full flex-col">
            <div className="flex flex-col space-y-3">
              <Link to="/forms" className="btn btn-ghost w-full gap-2">
                <ArrowLeft />
                <span>Back to your forms</span>
              </Link>

              <Link to={`/${data.form.slug}/details`} className="btn btn-ghost w-full gap-2">
                <PageEdit />
                <span>See form's details</span>
              </Link>
            </div>

            <div className="divider"></div>
            {data.form.messages.length === 0 ? (
              <p className="p-4">
                No new messages
              </p>
            ) : (
              <ul className="base-100 menu rounded-box -m-2 space-y-2 p-2">
                <li className="menu-title">
                  <span>Messages</span>
                </li>
                {data.form.messages.map((message) => (
                  <li key={message.id}>
                    <NavLink
                      className={({ isActive }) => `${isActive ? "bg-base-300" : ""} flex flex-col items-start`}
                      to={message.id}
                      onClick={() => appDrawerToggleRef?.current?.click()}
                    >
                      <span>
                        {message.object ? (
                          <>{message.object}, </>
                        ) : null}
                        {format(new Date(message.createdAt), "dd MMMM yyyy 'at' hh:mm")}
                      </span>
                      {
                        message.from
                          ? <span className="opacity-60 -mt-4">from {message.from}</span>
                          : null
                      }
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Website not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

