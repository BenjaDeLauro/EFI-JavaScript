import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { fetchWithToken } from "../../api/api";
import ReviewForm from "./ReviewForm";
import { Button } from "primereact/button";
import { isAdmin } from "../../utils/roles";
import { toast } from "react-toastify";

export default function ReviewList() {
  const { token, user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadReviews = async () => {
    const data = await fetchWithToken("/reviews", "GET", null, token);
    setReviews(Array.isArray(data) ? data : []);
  };

  const deleteReview = async (id) => {
    const res = await fetch(`http://localhost:5000/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast.success("Reseña eliminada");
      loadReviews();
    } else toast.error("Error al eliminar");
  };

  useEffect(() => {
    loadReviews();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>Reseñas</h2>
      <ReviewForm onSuccess={loadReviews} editData={editing} clearEdit={() => setEditing(null)} />
      {reviews.map((r) => (
        <div key={r.id} className="card p-3 mt-3">
          <h5>{r.title}</h5>
          <p>{r.comment}</p>
          <small>Autor: {r.author}</small>
          <div className="mt-2 flex gap-2">
            {(isAdmin(user) || user?.id === r.user_id) && (
              <>
                <Button
                  label="Editar"
                  icon="pi pi-pencil"
                  severity="info"
                  size="small"
                  onClick={() => setEditing(r)}
                />
                <Button
                  label="Eliminar"
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  onClick={() => deleteReview(r.id)}
                />
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
