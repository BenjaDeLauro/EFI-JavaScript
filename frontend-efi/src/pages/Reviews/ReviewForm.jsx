import React, { useState, useContext } from "react";
import { Button } from "primereact/button";
import { AuthContext } from "../../auth/AuthContext";
import { fetchWithToken } from "../../api/api";
import { toast } from "react-toastify";

export default function ReviewForm({ onCreated }) {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !comment) {
      toast.error("Completá todos los campos");
      return;
    }

    try {
      const res = await fetchWithToken("/reviews", "POST", { title, comment }, token);
      if (res.msg === "Review creada") {
        toast.success("Reseña publicada");
        setTitle("");
        setComment("");
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
      <h3>Nueva Reseña</h3>
      <form className="review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Comentario"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <Button label="Publicar" icon="pi pi-save" type="submit" />
      </form>
    </div>
  );
}
