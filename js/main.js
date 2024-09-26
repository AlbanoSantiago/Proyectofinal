// Array de productos
const productos = [
    { id: "producto-01", titulo: "Guantes de MMA", precio: 45.00, img: "./img/guante.png" },
    { id: "producto-02", titulo: "Espinilleras de combate", precio: 30.00, img: "./img/espinillera.png" },
    { id: "producto-03", titulo: "Bucal", precio: 20.00, img: "./img/bucal.png" },
    { id: "producto-04", titulo: "Short de entrenamiento", precio: 25.00, img: "./img/licra.png" },
    { id: "producto-05", titulo: "Rash (playera) de entrenamiento", precio: 45.00, img: "./img/playera-algodon.jpeg" },
];

// Variables para carrito y total
let carrito = [];
let total = 0;

// Mostrar los productos en la página
const contenedorProductos = document.querySelector("#equipos-lista");
const carritoDiv = document.querySelector("#carrito");
const totalDiv = document.querySelector("#total");

// Función para agregar productos al HTML
function mostrarProductos() {
    productos.forEach((producto) => {
        let div = document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `
            <img class="producto-img" src="${producto.img}" alt="${producto.titulo}">
            <h3>${producto.titulo}</h3>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
        `;

        let button = document.createElement("button");
        button.classList.add("producto-btn");
        button.innerText = "Agregar al carrito";
        button.addEventListener("click", () => {
            agregarAlCarrito(producto);
        });

        div.append(button);
        contenedorProductos.append(div);
    });
}

// Función para agregar producto al carrito
function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarCarrito();
    calcularTotal();
}

// Función para mostrar los productos en el carrito
function actualizarCarrito() {
    carritoDiv.innerHTML = ""; 
    carrito.forEach((producto, index) => {
        let itemCarrito = document.createElement("div");
        itemCarrito.classList.add("item-carrito");

        itemCarrito.innerHTML = `
            <p>${producto.titulo} - $${producto.precio.toFixed(2)}</p>
            <button class="btn btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;

        carritoDiv.append(itemCarrito);
    });
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
    calcularTotal();
}

// Función para calcular el total de la compra
function calcularTotal() {
    total = carrito.reduce((acc, producto) => acc + producto.precio, 0);
    const iva = total * 0.16;
    const totalConIva = total + iva;
    totalDiv.innerHTML = `Total: $${total.toFixed(2)} (sin IVA)<br>IVA (16%): $${iva.toFixed(2)}<br>Total con IVA: $${totalConIva.toFixed(2)}`;
}

// Función para realizar la facturación de los productos comprados
function calcularFactura() {
    const iva = 0.16;

    let nombre = prompt("Ingresa Nombre o Razón Social del Cliente:");
    let calleNumeroExterior = prompt("Ingresa Calle y número exterior del Domicilio del Cliente:");
    let numeroInterior = prompt("Ingresa número Interior");
    let colonia = prompt("Ingresa Colonia");
    let alcaldiaMunicipio = prompt("Ingresa Alcaldía o Municipio");
    let codigoPostal = prompt("Ingresa Código Postal");
    let entidadFederativa = prompt("Ingresa Entidad Federativa");
    let pais = prompt("Ingresa País");
    let rfc = prompt("Ingresa RFC del Cliente:");

    let ivaCalculado = total * iva;
    let totalConIva = total + ivaCalculado;

    // Aplicar descuento si se compraron más de dos productos
    if (carrito.length > 2) {
        let descuento = total * 0.10;
        totalConIva -= descuento;
        alert(`¡Felicidades! Has recibido un descuento del 10%. Tu nuevo total es: $${totalConIva.toFixed(2)}`);
    }

    // Mostrar la factura
    let factura =
        "--- Factura ---\n" +
        "Nombre: " + nombre.toUpperCase() + "\n" +
        "Calle y Número Exterior: " + calleNumeroExterior.toUpperCase() + "\n" +
        "Número interior: " + numeroInterior.toUpperCase() + "\n" +
        "Colonia: " + colonia.toUpperCase() + "\n" +
        "Alcaldía o Municipio: " + alcaldiaMunicipio.toUpperCase() + "\n" +
        "Código Postal: " + codigoPostal.toUpperCase() + "\n" +
        "Entidad Federativa: " + entidadFederativa.toUpperCase() + "\n" +
        "País: " + pais.toUpperCase() + "\n" +
        "RFC: " + rfc.toUpperCase() + "\n" +
        "Total con IVA: $" + totalConIva.toFixed(2);

    alert(factura);

    // Preguntar si el usuario desea recibir la factura por correo
    let email = prompt("Por favor, ingresa tu correo electrónico:");
    let confirmacionEmail;

    while (true) {
        confirmacionEmail = prompt("Confirma tu correo electrónico:");
        if (email === confirmacionEmail) {
            let enviarFactura = prompt(`¿Estás seguro de que deseas enviar la factura a ${email}? (sí/no)`).toLowerCase();
            if (enviarFactura === "sí") {
                alert("Factura enviada a " + email);
            } else {
                alert("Gracias por tu compra. ¡Vuelve a comprar en 'BUDOKAN LUTA LIVRE MÉXICO'!");
            }
            break; // Salimos del bucle
        } else {
            alert("Los correos electrónicos no coinciden. Por favor, intenta de nuevo.");
            email = prompt("Por favor, ingresa tu correo electrónico nuevamente:");
        }
    }

    // Limpiar carrito después de la compra
    let productosFacturados = [...carrito]; // Guardar productos que se facturaron
    carrito = [];
    total = 0; // Reiniciar el total
    actualizarCarrito();
    calcularTotal();

    // Notificar los productos que no se compraron
    notificarProductosFaltantes(productosFacturados);
}

// Función para notificar productos que faltan
function notificarProductosFaltantes(productosFacturados) {
    let productosFaltantes = productos.filter(producto => !productosFacturados.includes(producto));
    let nombresFaltantes = productosFaltantes.map(producto => producto.titulo).join(", ");
    
    if (nombresFaltantes.length > 0) {
        alert(`Los siguientes productos no se compraron: ${nombresFaltantes}.`);
    } else {
        alert("¡Has comprado todos los productos disponibles!");
    }

    // Preguntar si desea seguir comprando
    let continuarCompra = prompt("¿Deseas seguir comprando? (sí/no)").toLowerCase();
    if (continuarCompra === "sí") {
        mostrarProductos();
        actualizarCarrito(); // Limpiar carrito visual
        calcularTotal(); // Reiniciar total
    } else {
        alert("Gracias por tu compra en 'BUDOKAN LUTA LIVRE MÉXICO'. ¡Hasta la próxima!");
    }
}

// Evento al botón de iniciar compra
document.getElementById("inicio-compra").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de continuar.");
    } else {
        calcularFactura();
    }
});

// Llamar a la función para mostrar productos
mostrarProductos();
