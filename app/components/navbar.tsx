import { Form, Link } from "@remix-run/react";

interface NavbarProps {
  user: { email: string };
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="navbar flex bg-neutral text-neutral-content">
      <div className="navbar-start">
        <h1 className="ml-3 text-xl font-bold text-primary">
          <Link to="/">
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
