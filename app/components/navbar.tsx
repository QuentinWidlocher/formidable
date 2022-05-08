import { Form, Link } from "@remix-run/react";
import BubbleUpload from "iconoir-react/dist/BubbleUpload";

interface NavbarProps {
  user: { email: string };
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="navbar flex bg-base-200 text-base-content">
      <div className="navbar-start">
        <h1 className="ml-3 text-xl font-bold text-primary">
          <Link to="/" className="flex space-x-2 items-center">
            <BubbleUpload className="text-base" />
            <span>Formidable</span>
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
