import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { fetchWithToken } from "../../api/api";
import { Button } from "primereact/button";
import PostForm from "./PostForm";
import { isAdmin } from "../../utils/roles";
import { toast } from "react-toastify";

export default function PostList() {
  const { token, user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadPosts = async () => {
    const data = await fetchWithToken("/posts", "GET", null, token);
    setPosts(Array.isArray(data) ? data : []);
  };

  const deletePost = async (id) => {
    const res = await fetch(`http://localhost:5000/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast.success("Publicación eliminada");
      loadPosts();
    } else toast.error("Error al eliminar");
  };

  useEffect(() => {
    loadPosts();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>Publicaciones</h2>
      <PostForm onSuccess={loadPosts} editData={editing} clearEdit={() => setEditing(null)} />
      <div className="posts-grid">
        {posts.map((p) => (
          <div key={p.id} className="card p-3 mt-3">
            <h5>{p.title}</h5>
            <p>{p.content}</p>
            <small>Autor: {p.author}</small>
            <div className="mt-2 flex gap-2">
              {(isAdmin(user) || user?.id === p.user_id) && (
                <>
                  <Button
                    label="Editar"
                    icon="pi pi-pencil"
                    severity="info"
                    size="small"
                    onClick={() => setEditing(p)}
                  />
                  <Button
                    label="Eliminar"
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    onClick={() => deletePost(p.id)}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
