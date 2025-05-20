
// Iniciar sesión
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("LogIn").value;
    const password = document.getElementById("LogPassword").value;


    console.log("Datos de inicio de sesión:", { name, password }); // Agrega esta línea para depurar

    if (!name || !password) {
        alert("Por favor ingresa tu nombre y contraseña.");
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password })
        });

        if (response.ok) {
            window.location.href = "/deudores";
        } else if (response.status === 401) {
            alert("Usuario o contraseña incorrectos. Si no tienes cuenta, regístrate.");
        } else if (response.status === 404) {
            alert("El usuario no existe. Por favor regístrate.");
        } else {
            alert("Error al iniciar sesión. Intenta de nuevo.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
    }
});
