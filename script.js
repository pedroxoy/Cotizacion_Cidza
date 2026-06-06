// Función para calcular subtotales y total
function calcular() {
  let filas = document.querySelectorAll("#cotizacion tbody tr");
  let total = 0;
  filas.forEach(fila => {
    let cantidad = parseFloat(fila.cells[3].querySelector("input").value) || 0;
    let precio = parseFloat(fila.cells[4].querySelector("input").value) || 0;
    let subtotal = cantidad * precio;
    fila.querySelector(".subtotal").textContent = subtotal.toFixed(2);
    total += subtotal;
  });
  document.getElementById("total").textContent = total.toFixed(2);
}

// Función para agregar nuevas filas
function agregarFila() {
  let tbody = document.querySelector("#cotizacion tbody");
  let nuevaFila = tbody.rows[0].cloneNode(true);
  nuevaFila.querySelectorAll("input").forEach(input => input.value = "");
  nuevaFila.querySelector(".subtotal").textContent = "0";
  tbody.appendChild(nuevaFila);
}

// Escuchar cambios en inputs
document.addEventListener("input", calcular);

// Función para descargar PDF con logos y encabezado
function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Logos en base64 (pendiente de convertir Kat.png e Ilva.png)
  // Ejemplo:
  // const logoKat = "data:image/png;base64,...";
  // const logoIlva = "data:image/png;base64,...";
  // doc.addImage(logoKat, "PNG", 10, 10, 40, 20);
  // doc.addImage(logoIlva, "PNG", 150, 10, 40, 20);

  // Encabezado de empresa
  doc.setFontSize(16);
  doc.text("CidZa, S.A.", 80, 20);
  doc.setFontSize(12);
  doc.text("REPRESENTACIONES", 80, 26);
  doc.setFontSize(10);
  doc.text("29 Avenida 30-46 zona 5, Colonia 20 de Octubre Tel: 3404 7715 Xela 4469 1143", 80, 32);

  // Tabla de cotización con columna Código
  let filas = document.querySelectorAll("#cotizacion tbody tr");
  let data = [];
  filas.forEach(fila => {
    let codigo = fila.cells[0].querySelector("input").value || "-";
    let area = fila.cells[1].querySelector("input").value || "-";
    let unidad = fila.cells[2].querySelector("select").value;
    let cantidad = fila.cells[3].querySelector("input").value || "0";
    let precio = fila.cells[4].querySelector("input").value || "0";
    let subtotal = fila.querySelector(".subtotal").textContent;
    data.push([codigo, area, unidad, cantidad, "Q" + precio, "Q" + subtotal]);
  });

  doc.autoTable({
    head: [["Código", "Concepto", "Unidad", "Cantidad", "Precio", "Subtotal"]],
    body: data,
    startY: 40,
    styles: { fontSize: 10, cellPadding: 4 }
  });

  let total = document.getElementById("total").textContent;
  doc.text(`TOTAL: Q${total}`, 14, doc.lastAutoTable.finalY + 10);

  doc.save("cotizacion.pdf");
}
