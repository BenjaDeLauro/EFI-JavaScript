import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <Card className="home-card p-4 text-center">
        <h1 className="mb-3">Bienvenidos a la E.F.I – JavaScript</h1>
        <p className="mb-4">
          Aplicación web desarrollada por <strong>Benjamín De Lauro</strong> y{" "}
          <strong>Esteban Rodríguez</strong>.
        </p>
        <div className="flex justify-content-center gap-2">
          <Button
            label="Ver Posts"
            icon="pi pi-book"
            onClick={() => navigate("/posts")}
          />
          <Button
            label="Ver Reviews"
            icon="pi pi-comments"
            severity="help"
            onClick={() => navigate("/reviews")}
          />
        </div>
      </Card>
    </div>
  );
}
