import React, { useState, useContext } from "react";
import { Button } from "primereact/button";
import { AuthContext } from "../../auth/AuthContext";
import { fetchWithToken } from "../../api/api";
import { toast } from "react-toastify";

export default function PostForm({ onCreated }) {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Completá todos los campos");
      return;
    }

    try {
      const res = await fetchWithToken("/posts", "POST", { title, content }, token);
      if (res.msg === "Post creado exitosamente") {
        toast.success("Publicación guardada");
        setTitle("");
        setContent("");
        onCreated && onCreated();
      } else {
        toast.error("Error al guardar");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
      console.error(error);
    }
  };

  return (
    <div className="section-container">
      <h3>Nueva Publicación</h3>
      <form className="post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button label="Publicar" icon="pi pi-save" type="submit" />
      </form>
    </div>
  );
}
