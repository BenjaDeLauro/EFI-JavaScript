import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <span className="p-float-label">
          <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="email">Email</label>
        </span>
        <span className="p-float-label mt-3">
          <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask />
          <label htmlFor="password">Contraseña</label>
        </span>
        <Button label="Entrar" icon="pi pi-sign-in" className="mt-4 w-full" type="submit" />
      </form>
    </div>
  );
}
