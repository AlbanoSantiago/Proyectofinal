// Array de productos (respaldo por si falla la carga desde JSON)
const productosBackup = [
    { id: "producto-01", titulo: "Guantes de MMA", precio: 45.00, img: "./img/guante.png" },
    { id: "producto-02", titulo: "Espinilleras de combate", precio: 30.00, img: "./img/espinillera.png" },
    { id: "producto-03", titulo: "Bucal", precio: 20.00, img: "./img/bucal.png" },
    { id: "producto-04", titulo: "Short de entrenamiento", precio: 25.00, img: "./img/licra.png" },
    { id: "producto-05", titulo: "Rash (playera) de entrenamiento", precio: 45.00, img: "./img/playera-algodon.jpeg" },
];

// Variables globales
let carrito = [];
let total = 0;

// Selección del DOM
const contenedorProductos = document.querySelector("#equipos-lista");
const carritoDiv = document.querySelector("#carrito");
const totalDiv = document.querySelector("#total");

// Cargar productos desde un archivo JSON usando fetch
async function cargarProductos() {
    try {
        const respuesta = await fetch("./productos.json");
        if (!respuesta.ok) throw new Error("Error al cargar JSON");
        const productos = await respuesta.json();
        console.log("Productos cargados:", productos); // Verificar productos
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        mostrarProductos(productosBackup); // Usar respaldo si falla
    }
}

// Mostrar los productos en el DOM
function mostrarProductos(productos) {
    contenedorProductos.innerHTML = "";
    productos.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-img" src="${producto.img}" alt="${producto.titulo}">
            <h3>${producto.titulo}</h3>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
        `;
        const button = document.createElement("button");
        button.classList.add("producto-btn");
        button.innerText = "Agregar al carrito";
        button.addEventListener("click", () => agregarAlCarrito(producto));
        div.append(button);
        contenedorProductos.append(div);
    });
}

// Agregar producto al carrito
function agregarAlCarrito(producto) {
    carrito.push(producto);
    Swal.fire("Producto agregado", `${producto.titulo} se ha añadido al carrito.`, "success");
    actualizarCarrito();
    calcularTotal();
}

// Actualizar el carrito en el DOM
function actualizarCarrito() {
    carritoDiv.innerHTML = "";
    carrito.forEach((producto, index) => {
        const item = document.createElement("div");
        item.classList.add("item-carrito");
        item.innerHTML = `
            <p>${producto.titulo} - $${producto.precio.toFixed(2)}</p>
            <button class="btn btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        carritoDiv.append(item);
    });
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
    calcularTotal();
}

// Calcular el total con IVA
function calcularTotal() {
    total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    const iva = total * 0.16;
    const totalConIva = total + iva;
    totalDiv.innerHTML = `
        Total: $${total.toFixed(2)} (sin IVA)<br>
        IVA (16%): $${iva.toFixed(2)}<br>
        Total con IVA: $${totalConIva.toFixed(2)}
    `;
}

// Confirmar compra y generar factura
function confirmarCompra() {
    Swal.fire({
        title: "¿Confirmar compra?",
        text: `Total: $${total.toFixed(2)} (sin IVA)`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            generarFactura();
        }
    });
}

// Generar factura con datos del cliente
function generarFactura() {
    const nombre = prompt("Ingresa Nombre o Razón Social del Cliente:");
    const direccion = prompt("Ingresa Calle y Número Exterior:");
    const rfc = prompt("Ingresa RFC del Cliente:");

    let totalConIva = total * 1.16;
    if (carrito.length > 2) {
        const descuento = total * 0.10;
        totalConIva -= descuento;
        alert(`¡Descuento aplicado! Nuevo total: $${totalConIva.toFixed(2)}`);
    }

    const factura = `
    --- Factura ---
    Cliente: ${nombre.toUpperCase()}
    Dirección: ${direccion.toUpperCase()}
    RFC: ${rfc.toUpperCase()}
    Total con IVA: $${totalConIva.toFixed(2)}
    `;

    alert(factura);

    const email = prompt("Ingresa tu correo electrónico:");
    Swal.fire("Factura enviada", `Se ha enviado la factura a ${email}.`, "success");

    carrito = [];
    actualizarCarrito();
    calcularTotal();
}

// Evento del botón para iniciar compra
document.getElementById("inicio-compra").addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire("Carrito vacío", "Por favor, agrega productos antes de continuar.", "warning");
    } else {
        confirmarCompra();
    }
});

// Cargar los productos al iniciar la aplicación
cargarProductos();
