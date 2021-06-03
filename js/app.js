// Contructores
function Seguro( marca, year, tipo ){

    this.marca = marca;
    this.year = year;
    this.tipo = tipo;

}

Seguro.prototype.cotizarSeguro = function() {
    /* 
        1 = 1.15
        2 = 1.05
        3 = 1.35
     */

    let cantidad,
        base = 2000;

    switch (parseInt(this.marca)) {
        case 1:
            cantidad = base * 1.15;
            break;
        case 2:
            cantidad = base * 1.05;
            break;
        case 3:
            cantidad = base * 1.35;
            break;
    
        default:
            console.log('No es un opcion');
            break;
    }

    // Leer año
    const diferencia = new Date().getFullYear() - this.year;

    // Cada años que la diferencua es mayor, el costo va a reducir un 3%
    cantidad -= ((diferencia * 3) * cantidad ) / 100;

    // Si el seguro es basico se multiplica por un 30%
    // Si el seguro es completo se multiplica por un 50%
    if( this.tipo === 'basico' ){
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;

}

function UI() {} // Contendra las funciones de la interfaz de usuario

// Llena las opciones de los años
UI.prototype.llenarYear = function(){

    const max = new Date().getFullYear(),
          min  = max - 21;

    const selectYear = document.querySelector('#year');

    for( let i = max; i >= min; i--){

        const opcion = document.createElement('option');
        opcion.value = i;
        opcion.innerHTML = i;
        selectYear.appendChild(opcion);

    }
}

// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = function( mensaje, tipo ){

    const div = document.createElement('div');

    if ( tipo === 'error' ){
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.innerHTML = mensaje;

    // Insertar en html
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore( div, document.querySelector('#resultado'))

    setTimeout(() => {

        div.remove();
        
    }, 3000);
}

UI.prototype.mostrarResultado = function(total, seguro){

    const { marca, year, tipo } = seguro;
    let txtMarca;
    switch (parseInt(marca)) {
        case 1:
            txtMarca = 'Americano';
            break;
        case 2:
            txtMarca = 'Asiatico';
            break;
        case 3:
            txtMarca = 'Europeo';
            break;
        default:
            break;
    }

    // Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${txtMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo de seguro: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
    `;

    const divResultado = document.querySelector('#resultado');

    // Mostrar el spinner 
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    setTimeout(() => {
        spinner.style.display = 'none'; // Se borrar el spinner
        divResultado.appendChild(div); // Se muestra el resultado
    }, 3000);

}

// Inicia UI
const ui = new UI(); // Se hace una instancia para poder utilizar las funciones

document.addEventListener('DOMContentLoaded', () => {

    ui.llenarYear(); // Llena las opciones de años

});

// Eventos 
const addEventListeners = () =>{

    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);

}

// Funciones de eventos
const cotizarSeguro = (e) => {

    e.preventDefault();

    // leer marca
    const marca = document.querySelector('#marca').value;

    // leer año
    const year = document.querySelector('#year').value;

    // leer tipo de covertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    // validar
    if ( marca === '' || year === '' || tipo === ''){

        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;

    } 
    
    ui.mostrarMensaje('Cotizando...', 'exito');

    // Borrar resultados previos
    const resultados = document.querySelector('#resultado div');
    if( resultados != null){
        resultados.remove();
    }

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    // Utilizar el prototype
    ui.mostrarResultado(total, seguro)

}

addEventListeners();