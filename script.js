// Elementos del DOM
const form = document.getElementById('wireCalculator');
const addButton = document.getElementById('addDimension');
const dimensionsContainer = document.getElementById('dimensionsContainer');
const summaryTable = document.getElementById('summaryTable');
const summaryTableBody = summaryTable.querySelector('tbody');

// Función para agregar una nueva fila de dimensión
addButton.addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.className = 'dimension-row';
    newRow.innerHTML = `
        <div>
            <label>Dimensión (mm):</label>
            <input type="number" class="dimension" min="0" step="any" required>
        </div>
        <div>
            <label>Cantidad:</label>
            <input type="number" class="quantity" min="1" required>
        </div>
        <div>
            <label>Tipo de Alambre:</label>
            <select class="wireType" required>
                <option value="0.225">N° 4</option>
                <option value="0.164">N° 6</option>
                <option value="0.107">N° 8</option>
                <option value="0.071">N° 10</option>
                <option value="0.047">N° 12</option>
                <option value="0.021">N° 15</option>
                <option value="0.027">N° 14</option>
            </select>
        </div>
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Eliminar</button>
    `;
    dimensionsContainer.appendChild(newRow);
});

// Función para calcular el consumo de alambre
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar que el formulario recargue la página

    // Variables para guardar el cálculo
    const rows = dimensionsContainer.querySelectorAll('.dimension-row');
    const results = {}; // Objeto para almacenar datos por tipo de alambre

    let totalConsumo = 0;

    // Iterar por cada fila para realizar el cálculo
    rows.forEach(row => {
        const dimension = parseFloat(row.querySelector('.dimension').value) || 0;
        const cantidad = parseInt(row.querySelector('.quantity').value) || 0;
        const modulacion = parseFloat(row.querySelector('.wireType').value);
        const wireType = row.querySelector('.wireType').selectedOptions[0].textContent;

        // Validar datos ingresados
        if (dimension <= 0 || cantidad <= 0) {
            alert('Por favor, ingrese valores válidos mayores que 0');
            return;
        }

        // Calcular subtotal en kilogramos
        const subtotal = (dimension * cantidad * modulacion) / 1000;
        totalConsumo += subtotal;

        // Guardar resultados agrupados por tipo de alambre
        if (!results[wireType]) {
            results[wireType] = { totalDimension: 0, totalConsumo: 0 };
        }
        results[wireType].totalDimension += dimension * cantidad;
        results[wireType].totalConsumo += subtotal;
    });

    // Limpiar el contenido previo de la tabla
    summaryTableBody.innerHTML = '';

    // Crear las filas de la tabla resumen
    for (const wireType in results) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${wireType}</td>
            <td>${results[wireType].totalDimension.toFixed(2)} mm</td>
            <td>${results[wireType].totalConsumo.toFixed(2)} kg</td>
        `;
        summaryTableBody.appendChild(row);
    }

    // Mostrar la tabla si tiene contenido
    if (Object.keys(results).length > 0) {
        summaryTable.classList.remove('hidden'); // Mostrar la tabla
    } else {
        summaryTable.classList.add('hidden'); // Ocultar la tabla si no hay resultados
    }
});
