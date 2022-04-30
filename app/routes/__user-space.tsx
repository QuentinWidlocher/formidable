import Navbar from "~/components/navbar";
import type { User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUser } from "~/session.server";
import { Outlet, useLoaderData } from "@remix-run/react";

type LoaderData = {
  user: User
}

export let loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)
  return json<LoaderData>({
    user
  })
}

export default function WebsiteLayout() {
  let data = useLoaderData() as LoaderData;
  return <>
    <Navbar user={data.user} />
    <Outlet />
  </>
}