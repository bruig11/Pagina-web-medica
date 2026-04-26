const observador = new IntersectionObserver(
    (entradas) => {
        entradas.forEach((entrada, i) => {
            if (entrada.isIntersecting) {
                setTimeout(() => {
                    entrada.target.classList.add('visible');
                }, i * 80);
                observador.unobserve(entrada.target);
            }
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll('.fade-in-up').forEach(el => observador.observe(el));

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navegacion');
    if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 24px rgba(10,42,94,0.16)';
    } else {
        navbar.style.boxShadow = '0 2px 16px rgba(10,42,94,0.10)';
    }
});

const especialidades = ["Pediatría", "Cardiología", "Medicina General", "Dermatología", "Ginecología", "Laboratorio"];
const montos = [40000, 65000, 30000, 18000, 45000, 12000];

function obtenerMonto(esp) {
  let i = especialidades.indexOf(esp);
  return i !== -1 ? montos[i] : 0;
}

function validarCampo(id, condicion, mensaje) {
  let campo = document.getElementById(id);
  let error = document.getElementById("err-" + id);

  if (condicion) {
    campo.classList.remove("campo-invalido");
    campo.classList.add("campo-valido");
    error.textContent = "";
    return true;
  } else {
    campo.classList.remove("campo-valido");
    campo.classList.add("campo-invalido");
    error.textContent = mensaje;
    return false;
  }
}

function validarNombre() {
  let val = document.getElementById("nombre").value.trim();
  return validarCampo("nombre", val !== "", "El nombre es obligatorio.");
}

function validarCorreo() {
  let val = document.getElementById("correo").value.trim();
  return validarCampo("correo", val.includes("@") && val.includes("."), "Correo inválido.");
}

function validarTelefono() {
  let val = document.getElementById("telefono").value.trim();
  return validarCampo("telefono", /^\d{8,10}$/.test(val), "Teléfono debe tener 8 a 10 dígitos.");
}

function validarEdad() {
  let val = document.getElementById("edad").value;
  return validarCampo("edad", val !== "" && val > 0, "Ingrese una edad válida.");
}

function validarEspecialidad() {
  let val = document.getElementById("especialidad").value;
  return validarCampo("especialidad", val !== "", "Seleccione una especialidad.");
}

function validarFecha() {
  let txt = document.getElementById("fecha").value;
  if (txt === "") return validarCampo("fecha", false, "Seleccione una fecha.");

  let fecha = new Date(txt + "T00:00:00");
  let hoy = new Date(); hoy.setHours(0, 0, 0, 0);

  if (fecha < hoy) return validarCampo("fecha", false, "No puede seleccionar una fecha pasada.");
  if (fecha.getDay() === 0 || fecha.getDay() === 6) return validarCampo("fecha", false, "No se permiten citas en fines de semana.");

  return validarCampo("fecha", true, "");
}

function validarHora() {
  let val = document.getElementById("hora").value;
  return validarCampo("hora", val !== "" && val >= "09:00" && val <= "17:00", "Hora debe estar entre 09:00 y 17:00.");
}

function validarMotivo() {
  let val = document.getElementById("motivo").value.trim();
  return validarCampo("motivo", val !== "", "Ingrese el motivo de consulta.");
}

document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("nombre").addEventListener("input", validarNombre);
  document.getElementById("correo").addEventListener("input", validarCorreo);
  document.getElementById("telefono").addEventListener("input", validarTelefono);
  document.getElementById("edad").addEventListener("input", validarEdad);
  document.getElementById("especialidad").addEventListener("change", validarEspecialidad);
  document.getElementById("fecha").addEventListener("change", validarFecha);
  document.getElementById("hora").addEventListener("change", validarHora);

  document.getElementById("motivo").addEventListener("input", function () {
    document.getElementById("contador-motivo").textContent = this.value.length + " / 250";
    validarMotivo();
  });

});

//Confirmar cita

function confirmarCita() {
  let valido = validarNombre() & validarCorreo() & validarTelefono() & validarEdad() &
               validarEspecialidad() & validarFecha() & validarHora() & validarMotivo();

  if (!valido) {
    alert("Hay campos pendientes o incorrectos. Por favor revíselos.");
    return;
  }

  let nombre = document.getElementById("nombre").value.trim();
  let edad   = parseInt(document.getElementById("edad").value);
  let esp    = document.getElementById("especialidad").value;
  let fecha  = document.getElementById("fecha").value;
  let hora   = document.getElementById("hora").value;

  let monto = obtenerMonto(esp);
  if (edad < 10 && esp !== "Pediatría") monto *= 0.9;

  let folio = "Cita-" + Math.floor(Math.random() * 100000);

  document.getElementById("numero-folio").textContent         = folio;
  document.getElementById("resumen-nombre").textContent       = nombre;
  document.getElementById("resumen-especialidad").textContent = esp;
  document.getElementById("resumen-fecha").textContent        = fecha;
  document.getElementById("resumen-hora").textContent         = hora;
  document.getElementById("resumen-monto").textContent        = "₡" + monto.toLocaleString("es-CR");

  document.getElementById("seccion-formulario").style.display = "none";
  document.getElementById("seccion-confirmacion").style.display          = "block";
}

//Limpiar

function limpiarFormulario() {
  document.querySelectorAll("input, textarea, select").forEach(el => el.value = "");
  document.getElementById("contador-motivo").textContent = "0 / 250";

  ["nombre","correo","telefono","edad","especialidad","fecha","hora","motivo"].forEach(function (id) {
    let campo = document.getElementById(id);
    campo.classList.remove("campo-valido", "campo-invalido");
    document.getElementById("err-" + id).textContent = "";
  });
}

//nueva cita

function nuevaReserva() {
  document.getElementById("seccion-confirmacion").style.display          = "none";
  document.getElementById("seccion-formulario").style.display = "block";
  limpiarFormulario();
}