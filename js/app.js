// variable y selectores 

const formulario = document.querySelector('#agregar-gasto')
const gastosListado = document.querySelector('#gastos ul')




//eventos
eventListener()
function eventListener(params) {
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto)

    formulario.addEventListener('submit',agregarGasto)
}


//clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto)
        this.restante   =  Number(presupuesto)
        this.gastos  = []
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto]
        this.calcularRestante()
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total,gasto)=>total + gasto.cantidad, 0 )
        this.restante = this.presupuesto - gastado
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto =>gasto.id !== id )
        this.calcularRestante()
        
    }
}

class UI{

    insertarPresupuesto(cantidad){
        const{presupuesto,restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
    }

    imprimirAlerta(mensaje,tipo){

        const divMensaje = document.createElement('div')
        divMensaje.classList.add('text-center','alert')

        if (tipo==='error') {
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success')
        }

        divMensaje.textContent = mensaje

        document.querySelector('.primario').insertBefore(divMensaje,formulario)

        setTimeout(() => {
            divMensaje.remove()
        }, 3000);

    }

    mostrarGastos(gastos){


        this.limpiarHtml()

        gastos.forEach(gasto => {
            const {cantidad,nombre,id}=gasto

            const nuevoGasto = document.createElement('li')
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'
            // nuevoGasto.setAttribute('data-id',id)
            nuevoGasto.dataset.id = id //hace lo mismo que arriba

            nuevoGasto.innerHTML=`${nombre} <span class ="badge badge-primary badge-pill">$ ${cantidad}</span>`
            
            const btnBorrar = document.createElement('button')
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto')
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () =>{
                eliminarGasto(id)
            }

            nuevoGasto.appendChild(btnBorrar)

            gastosListado.appendChild(nuevoGasto)

        });
    }

    limpiarHtml(){
        while (gastosListado.firstChild) {
            gastosListado.removeChild(gastosListado.firstChild)
            
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto,restante} = presupuestoObj

        const restanteDiv = document.querySelector('.restante')

        //comprobar 25%

        if ((presupuesto / 4 ) > restante) {
            restanteDiv.classList.remove('alert-success','alert-warning')
            restanteDiv.classList.add('alert-danger')
        } else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning')
            restanteDiv.classList.add('alert-success')
        }


        if (restante <=0) {
            ui.imprimirAlerta('El presupuesto se ha agotado','error')
            formulario.querySelector('button[type = "submit"]').disabled = true
        }
    }

}

const ui = new UI()
let presupuesto;


//funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?')

    if (presupuestoUsuario ==='' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <=0) {
        window.location.reload;
    }

    presupuesto = new Presupuesto(presupuestoUsuario)

    ui.insertarPresupuesto(presupuesto)

    
    
}

function agregarGasto(e) {
    e.preventDefault();

    //leer los datso del form

    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value)


    if (nombre ==='' || cantidad ==='') {
        ui.imprimirAlerta('Ambos campos son obligatorios','error')
        return
    }else if(cantidad<=0|| isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida','error')
        return
    }

    const gasto = {nombre,cantidad,id:Date.now()}

    presupuesto.nuevoGasto(gasto)

    ui.imprimirAlerta('Gasto agregado')

    const {gastos,restante} = presupuesto;

    ui.mostrarGastos(gastos)

    ui.actualizarRestante(restante)

    ui.comprobarPresupuesto(presupuesto)

    formulario.reset();


}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id)

    const {gastos,restante} = presupuesto

    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)
}