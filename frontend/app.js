const API_BASE = "/api/productos";
let editandoId = null;

const grid = document.getElementById("productosGrid");
const btnCargar = document.getElementById("btnCargar");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const formTitle = document.getElementById("formTitle");
const statusDiv = document.getElementById("status");
const inputNombre = document.getElementById("nombre");
const inputDescripcion = document.getElementById("descripcion");
const inputPrecio = document.getElementById("precio");
const inputStock = document.getElementById("stock");

const iconos = ["👕","👖","🧥","👗","👟","🧢","👜","🧣","👔","👘","🥾","🎒"];

function setStatus(msg, tipo) {
  statusDiv.textContent = msg;
  statusDiv.className = "show " + (tipo || "ok");
}

function hideStatus() { statusDiv.className = ""; statusDiv.textContent = ""; }

async function cargarProductos() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Error");
    const data = await res.json();
    renderProductos(data);
    setStatus("Productos cargados correctamente.", "ok");
  } catch (err) {
    grid.innerHTML = `<p style="color:#b91c1c;">No se pudieron cargar los productos. ¿Está el backend levantado?</p>`;
    setStatus("Error al conectar con el backend.", "error");
  }
}

function renderProductos(productos) {
  if (!productos.length) {
    grid.innerHTML = `<p style="color:#888;">No hay productos registrados.</p>`;
    return;
  }
  grid.innerHTML = productos.map(p => {
    const icono = iconos[p.id % iconos.length];
    return `
      <div class="producto-card">
        <div class="icon">${icono}</div>
        <h3>${p.nombre}</h3>
        <div class="desc">${p.descripcion || "Sin descripción"}</div>
        <div class="meta">
          <span class="precio">$${Number(p.precio).toFixed(2)}</span>
          <span class="stock">Stock: <span>${p.stock}</span></span>
        </div>
        <div class="acciones">
          <button class="btn btn-sm btn-outline" data-id="${p.id}" onclick="editarProducto(${p.id})">Editar</button>
          <button class="btn btn-sm btn-danger" data-id="${p.id}" onclick="eliminarProducto(${p.id})">Eliminar</button>
        </div>
      </div>
    `;
  }).join("");
}

function limpiarFormulario() {
  editandoId = null;
  formTitle.textContent = "Nuevo producto";
  inputNombre.value = "";
  inputDescripcion.value = "";
  inputPrecio.value = "";
  inputStock.value = "";
  hideStatus();
}

function obtenerDatosFormulario() {
  return {
    nombre: inputNombre.value.trim(),
    descripcion: inputDescripcion.value.trim(),
    precio: parseFloat(inputPrecio.value),
    stock: parseInt(inputStock.value, 10),
  };
}

function validarProducto(prod) {
  if (!prod.nombre) return "El nombre es obligatorio.";
  if (isNaN(prod.precio) || prod.precio < 0) return "El precio debe ser un número mayor o igual a 0.";
  if (isNaN(prod.stock) || prod.stock < 0) return "El stock debe ser un número mayor o igual a 0.";
  return null;
}

async function guardarProducto() {
  const producto = obtenerDatosFormulario();
  const error = validarProducto(producto);
  if (error) { setStatus(error, "error"); return; }
  try {
    let res;
    if (editandoId) {
      res = await fetch(`${API_BASE}/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });
    } else {
      res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Error al guardar");
    }
    limpiarFormulario();
    await cargarProductos();
    setStatus(editandoId ? "Producto actualizado." : "Producto creado.", "ok");
  } catch (err) {
    setStatus("Ocurrió un error al guardar.", "error");
  }
}

async function editarProducto(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener");
    const p = await res.json();
    editandoId = p.id;
    formTitle.textContent = `Editar producto #${p.id}`;
    inputNombre.value = p.nombre;
    inputDescripcion.value = p.descripcion || "";
    inputPrecio.value = p.precio;
    inputStock.value = p.stock;
    setStatus("Editando producto.", "ok");
    window.scrollTo({ top: document.querySelector("section:last-child").offsetTop - 20, behavior: "smooth" });
  } catch (err) {
    setStatus("No se pudo cargar el producto.", "error");
  }
}

async function eliminarProducto(id) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar");
    await cargarProductos();
    setStatus("Producto eliminado.", "ok");
  } catch (err) {
    setStatus("No se pudo eliminar.", "error");
  }
}

btnCargar.addEventListener("click", cargarProductos);
btnGuardar.addEventListener("click", guardarProducto);
btnCancelar.addEventListener("click", () => { limpiarFormulario(); setStatus("Edición cancelada.", "ok"); });
cargarProductos();
