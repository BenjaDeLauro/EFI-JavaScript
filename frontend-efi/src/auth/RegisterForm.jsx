import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const roles = [
    { label: "Usuario", value: "user" },
    { label: "Administrador", value: "admin" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) toast.success("Usuario registrado correctamente");
      else toast.error(data.msg || "Error al registrar");
    } catch {
      toast.error("Error de conexión");
    }
  };

  return (
    <div className="form-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <InputText placeholder="Nombre" className="w-full mb-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <InputText placeholder="Email" className="w-full mb-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Password placeholder="Contraseña" className="w-full mb-3" toggleMask feedback={false} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Dropdown placeholder="Seleccionar rol" className="w-full mb-3" options={roles} value={form.role} onChange={(e) => setForm({ ...form, role: e.value })} />
        <Button label="Registrarse" icon="pi pi-user-plus" className="w-full" type="submit" />
      </form>
    </div>
  );
}
