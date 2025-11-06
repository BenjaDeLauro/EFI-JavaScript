import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Componente reutilizable para mostrar toasts en toda la app.
 * 
 * ⚙️ Instrucciones:
 * - Importarlo una vez (por ejemplo en App.jsx debajo del <Navbar />)
 * - Luego usar toast.success(), toast.error(), etc. en cualquier parte.
 */

export default function ToastAlert() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
}
