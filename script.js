// Función para obtener la fecha actual en formato YYYY-MM-DD
function obtenerFechaActual() {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];  // Obtiene la fecha en formato yyyy-mm-dd
}

// Función para guardar los datos del gasto en localStorage
function guardarDatos() {
    const fecha = document.getElementById('fecha').value;
    const monto = document.getElementById('monto').value;
    const categoria = document.getElementById('categoria').value;
    const descripcion = document.getElementById('descripcion').value;
    const comprobante = document.getElementById('comprobante').files[0];

    // Valida que el monto esté ingresado
    if (!monto) {
        alert("Por favor, ingresa un monto.");
        return;
    }

    // Crear un objeto de gasto
    const gasto = {
        fecha: fecha,
        monto: parseFloat(monto),
        categoria: categoria,
        descripcion: descripcion || '',
        comprobante: comprobante ? URL.createObjectURL(comprobante) : ''
    };

    // Obtener los gastos anteriores del localStorage
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    
    // Añadir el nuevo gasto
    gastos.push(gasto);

    // Guardar los gastos actualizados en localStorage
    localStorage.setItem('gastos', JSON.stringify(gastos));

    alert("Gasto guardado correctamente.");
    limpiarFormulario();
}

// Función para limpiar el formulario después de guardar
function limpiarFormulario() {
    document.getElementById('fecha').value = obtenerFechaActual();
    document.getElementById('monto').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('comprobante').value = '';
}

// Función para alternar entre la fase de ingreso y el resumen
function mostrarFaseResumen() {
    document.getElementById('faseIngreso').style.display = 'none';
    document.getElementById('faseResumen').style.display = 'block';
}

function mostrarFaseIngreso() {
    document.getElementById('faseIngreso').style.display = 'block';
    document.getElementById('faseResumen').style.display = 'none';
}

// Función para filtrar los gastos según la categoría y fechas
function filtrarGastos() {
    const categoria = document.getElementById('filtroCategoria').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    // Obtener los gastos almacenados en localStorage
    const gastos = JSON.parse(localStorage.getItem('gastos')) || [];

    // Filtrar los gastos según la categoría y fechas
    let gastosFiltrados = gastos.filter(gasto => {
        const cumpleCategoria = categoria === "todas" || gasto.categoria === categoria;
        const cumpleFecha = (!fechaInicio || gasto.fecha >= fechaInicio) && (!fechaFin || gasto.fecha <= fechaFin);
        return cumpleCategoria && cumpleFecha;
    });

    // Mostrar el resumen
    mostrarResumen(gastosFiltrados);
}

// Función para mostrar los gastos filtrados en la página
function mostrarResumen(gastos) {
    const resultadoDiv = document.getElementById('resultadoResumen');
    resultadoDiv.innerHTML = '';  // Limpiar los resultados previos

    let totalGastos = 0;

    gastos.forEach(gasto => {
        // Crear una div para cada gasto
        const gastoDiv = document.createElement('div');
        gastoDiv.innerHTML = `
            <p><strong>Fecha:</strong> ${gasto.fecha}</p>
            <p><strong>Monto:</strong> S/ ${gasto.monto.toFixed(2)}</p>
            <p><strong>Categoría:</strong> ${gasto.categoria}</p>
            <p><strong>Descripción:</strong> ${gasto.descripcion || 'N/A'}</p>
            ${gasto.comprobante ? `<img src="${gasto.comprobante}" alt="Comprobante" width="100">` : ''}
            <hr>
        `;

        // Añadir el gasto al contenedor
        resultadoDiv.appendChild(gastoDiv);

        // Sumar al total
        totalGastos += gasto.monto;
    });

    // Mostrar el total
    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `<h3>Total de gastos: S/ ${totalGastos.toFixed(2)}</h3>`;
    resultadoDiv.appendChild(totalDiv);
}

// Asignar eventos a los botones
document.getElementById('guardar').addEventListener('click', guardarDatos);
document.getElementById('verResumen').addEventListener('click', mostrarFaseResumen);
document.getElementById('filtrar').addEventListener('click', filtrarGastos);
document.getElementById('volver').addEventListener('click', mostrarFaseIngreso);

// Inicializar la fecha por defecto en el campo de fecha
document.getElementById('fecha').value = obtenerFechaActual();