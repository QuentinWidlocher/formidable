import { Outlet } from "@remix-run/react";
import Navbar from "~/components/navbar";
import { useUser } from "~/utils";

export default function WebsiteLayout() {
  const user = useUser();
  return <>
    <Navbar user={user} />
    <Outlet />
  </>
}