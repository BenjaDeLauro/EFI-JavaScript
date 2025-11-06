import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { isAdmin } from "../utils/roles";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const items = [
    { label: "Inicio", icon: "pi pi-home", command: () => navigate("/") },
    { label: "Posts", icon: "pi pi-book", command: () => navigate("/posts") },
    { label: "Reviews", icon: "pi pi-comments", command: () => navigate("/reviews") },
  ];

  const end = user ? (
    <div className="flex align-items-center gap-2">
      <span className="text-sm text-light">
        <i className="pi pi-user mr-2" />
        {user.name} ({user.role})
      </span>
      {isAdmin(user) && <Button label="Panel" icon="pi pi-cog" size="small" severity="info" />}
      <Button
        label="Salir"
        icon="pi pi-sign-out"
        size="small"
        severity="danger"
        onClick={logout}
      />
    </div>
  ) : (
    <div className="flex align-items-center gap-2">
      <Link to="/login">
        <Button label="Login" icon="pi pi-sign-in" size="small" />
      </Link>
      <Link to="/register">
        <Button label="Registro" icon="pi pi-user-plus" size="small" severity="success" />
      </Link>
    </div>
  );

  return (
    <div className="shadow-2 mb-3">
      <Menubar model={items} end={end} />
    </div>
  );
}
