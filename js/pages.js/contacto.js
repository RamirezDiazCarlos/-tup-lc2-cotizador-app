function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
    document.getElementById('mensaje').value = '';
}

function validarFormulario(nombre, email, mensaje) {
    if (!nombre || !email || !mensaje) {
        alert('Por favor, complete todos los campos del formulario.');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingrese un correo electrónico válido.');
        return false;
    }
    return true;
}

function enviarFormulario() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

    if (!validarFormulario(nombre, email, mensaje)) {
        return;
    }

    const templateParams = {
        nombre: nombre,
        email: email,
        mensaje: mensaje
    };

    emailjs.send('service_r5e5mhk', 'template_wto855m', templateParams)
        .then((response) => {
            alert('Gracias por su comentario.');
            limpiarFormulario();
        }, (error) => {
            alert('Error al enviar el comentario. Por favor, inténtelo más tarde.');
        });
}