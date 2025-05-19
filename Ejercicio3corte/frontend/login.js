// Registrar empleado
document.getElementById("SignInButton").addEventListener("click", () => {
    const name = document.getElementById("SignIn").value;
    const password = document.getElementById("password").value;
    const passwordRepeat = document.getElementById("passwordRepeat").value;

    if (password !== passwordRepeat) {
        alert("Passwords do not match.");
        return;
    }

    if (!name || !password) {
        alert("All fields are required.");
        return;
    }

    const data = { name, password };

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("Registration failed.");
            }
        })
        .then(message => {
            alert(message);
            document.getElementById("SignIn").value = "";
            document.getElementById("password").value = "";
            document.getElementById("passwordRepeat").value = "";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while registering.");
        });
});

// Iniciar sesión
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("LogIn").value;
    const password = document.getElementById("LogPassword").value;

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
            window.location.href = "/deudores.html";
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
