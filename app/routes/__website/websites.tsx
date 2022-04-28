import type { Website } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  websites: Website[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const websites = await prisma.website.findMany({
    where: {
      userId
    }
  });

  return json<LoaderData>({websites});
}

export default function WebsiteList() {
  const data = useLoaderData() as LoaderData;

  return (
    <section className="card w-96 bg-base-200 my-5 shadow-xl mx-auto">
  <div className="card-body">
    <h2 className="card-title mb-5">Your websites</h2>
    <ul className="menu bg-base-100 rounded-box p-2">
      {data.websites.map(website => (
        <li key={website.url}>
          <Link to={`/${website.url}/messages`} className="flex flex-col items-start">
            <span>{website.name}</span>
            <span className="opacity-60 -mt-4">https://{website.url}/</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
  </section>
  )
}