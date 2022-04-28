import { Form, Link } from "@remix-run/react";
import { Menu } from "iconoir-react";
import type { LegacyRef } from "react";

interface NavbarProps {
  user: { email: string };
  appDrawerToggleRef: LegacyRef<HTMLLabelElement> | undefined;
}

export default function Navbar({ user, appDrawerToggleRef }: NavbarProps) {
  return (
    <header className="navbar flex bg-neutral text-neutral-content">
      <div className="navbar-start">
        <label
          ref={appDrawerToggleRef}
          htmlFor="app-drawer"
          className="btn btn-ghost btn-square lg:hidden"
        >
          <Menu />
        </label>
        <h1 className="ml-3 text-xl font-bold">
          <Link to=".">
            Formidable
          </Link>
        </h1>
      </div>
      <div className="navbar-end">
        <Form action="/logout" method="post">
          <div className="tooltip tooltip-left" data-tip={user.email}>
            <button type="submit" className="btn btn-ghost">
              Logout
            </button>
          </div>
        </Form>
      </div>
    </header>
  );
}
