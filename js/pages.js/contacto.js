function getValue(id) {
    return document.getElementById(id).value.trim();
}

function limpiarFormulario() {
    ["nombre", "email", "mensaje"].forEach((id) => {
        document.getElementById(id).value = "";
    });
}

function validarFormulario({ nombre, email, mensaje }) {
    if (!nombre || !email || !mensaje) {
        alert("Por favor, complete todos los campos del formulario.");
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, ingrese un correo electrónico válido.");
        return false;
    }
    return true;
}

function enviarFormulario() {
    const formData = {
        nombre: getValue("nombre"),
        email: getValue("email"),
        mensaje: getValue("mensaje"),
    };
    
    if (!validarFormulario(formData)) return;
    
    emailjs
        .send("service_r5e5mhk", "template_wto855m", formData)
        .then(() => {
            alert("Gracias por su comentario.");
            limpiarFormulario();
        })
        .catch(() => {
            alert("Error al enviar el comentario. Por favor, inténtelo más tarde.");
        });
}
