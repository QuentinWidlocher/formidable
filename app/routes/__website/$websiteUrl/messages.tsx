import type { Message, Website } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useCatch, useLoaderData, useOutletContext } from "@remix-run/react";
import { Plus } from "iconoir-react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  website: Website & { messages: Message[] };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.websiteUrl, "websiteUrl not found");

  const website = await prisma.website.findUnique({
    where: {
      id: {
        url: params.websiteUrl,
        userId,
      }
    },
    include: {
      messages: true,
    }
  })

  if (!website) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ website });
};

export default function NoteDetailsPage() {
  const data = useLoaderData() as LoaderData;
  const { appDrawerToggleRef } = useOutletContext<{ appDrawerToggleRef: React.MutableRefObject<HTMLLabelElement | null> }>();

  return (
    <div className="drawer-mobile drawer w-full flex-1">
      <input
        id="app-drawer"
        type="checkbox"
        className="drawer-toggle"
      ></input>
      <div className="drawer-content">
        <main className="h-full p-5">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side">
        <label htmlFor="app-drawer" className="drawer-overlay"></label>
        <div className="w-80 bg-base-200 p-2 lg:w-96">
          <div>
            <div className="flex h-full flex-col">
          <Link to="/websites" className="btn btn-ghost w-full gap-2">
            Back to your websites
          </Link>

      <div className="divider"></div>
              {data.website.messages.length === 0 ? (
                <p className="p-4">
                  No new messages
                </p>
              ) : (
                <ul className="base-100 menu rounded-box -m-2 space-y-2 p-2">
                   <li className="menu-title">
                      <span>Messages</span>
                    </li>
                  {data.website.messages.map((message) => (
                    <li key={message.id}>
                      <NavLink
                        className={({ isActive }) => `${isActive ? "bg-base-300" : ""} flex flex-col items-start`}
                        to={message.id}
                        onClick={() => appDrawerToggleRef?.current?.click()}
                      >
                        <span>{message.object}</span>
                        {message.from 
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

