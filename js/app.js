let tpresupuesto = 0;
const divPresupuesto = document.getElementById("divpresupuesto");
const presupuesto = document.getElementById("presupuesto");
const btnpresupuesto = document.getElementById("btnPre");
const divGastos = document.getElementById("divgastos");
const totalpresupuesto = document.getElementById("totalpre");
const guardar = document.getElementById("guardar");
const progress = document.getElementById("progress");
const listasgastos = document.getElementById("listasgastos");
const totalGastos = document.getElementById("totalgastos");
const disponible = document.getElementById("totaldisponible");
const filtrar = document.getElementById("filtrarcate");


function mostrarNotificacion(mensaje, tipo) {
  console.log(`Notificación: ${mensaje}, Tipo: ${tipo}`); 
  const color = tipo === 'error' ? '#f44336' : '#4caf50';
  const icono = tipo === 'error' ? '❌' : '✅';

  const div = document.createElement('div');
  div.style.position = 'fixed'; 
  div.style.top = '20px';
  div.style.left = '50%'; 
  div.style.transform = 'translateX(-50%)'; 
  div.style.padding = '10px';
  div.style.backgroundColor = color;
  div.style.color = '#fff';
  div.style.borderRadius = '5px';
  div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  div.style.zIndex = '9999';
  div.innerHTML = `<span style="font-size: 20px;">${icono}</span> ${mensaje}`;

  document.body.appendChild(div);

  setTimeout(() => {
    document.body.removeChild(div);
  }, 3000);
}








const categoriaImagenes = {
  "comida": "img/comida.jpg",
  "ahorro": "img/ahorro.jpg",
  "varios": "img/varios.jpg",
  "ocio": "img/ocio.jpg",
  "salud": "img/salud.jpg",
  "suscripciones": "img/suscripciones.jpg",
  "casa": "img/casa.jpg",
};


btnpresupuesto.onclick = async () => {
  tpresupuesto = parseFloat(presupuesto.value);
  if (isNaN(tpresupuesto) || tpresupuesto <= 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ingresa un número mayor a 0!",
    });
    return;
  }

 
  localStorage.setItem('presupuesto', tpresupuesto);

  divPresupuesto.classList.remove("d-block");
  divGastos.classList.remove("d-none");
  divPresupuesto.classList.add("d-none");
  divGastos.classList.add("d-block");
  totalpresupuesto.innerHTML = `$ ${tpresupuesto.toFixed(2)}`;

  await mostrarGastos();
};


window.onload = async () => {
  const savedPresupuesto = localStorage.getItem('presupuesto');
  if (savedPresupuesto) {
    tpresupuesto = parseFloat(savedPresupuesto);
    totalpresupuesto.innerHTML = `$ ${tpresupuesto.toFixed(2)}`;
    
    divPresupuesto.classList.remove("d-block");
    divGastos.classList.remove("d-none");
    divPresupuesto.classList.add("d-none");
    divGastos.classList.add("d-block");
    
    await mostrarGastos();
  } else {
    divPresupuesto.classList.remove("d-none");
    divGastos.classList.remove("d-block");
    divPresupuesto.classList.add("d-block");
    divGastos.classList.add("d-none");
  }
};

const guardarGastos = async () => {
  const desc = document.getElementById("Descripcion").value;
  const costo = parseFloat(document.getElementById("Gastos").value);
  const categoria = document.getElementById("cate2").value;
  

  const gastadototal = await calcularGastoTotal();
  const presupuestoDisponible = tpresupuesto - gastadototal;


  if (isNaN(costo) || costo <= 0) {
    mostrarNotificacion("Ingresa un costo válido!", 'error');
    return;
  }


  if (categoria === "todos") {
    mostrarNotificacion("SELECCIONA UNA CATEGORIA!", 'error');
    return;
  }


  if (costo > presupuestoDisponible) {
    mostrarNotificacion("El gasto supera el presupuesto disponible!", 'error');
    return;
  }

  try {

    const response = await fetch('add_gasto.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        descripcion: desc,
        costo: costo,
        categoria: categoria
      })
    });

 
    const result = await response.text();
    console.log(result);

    if (response.ok) {
      await mostrarGastos();
      document.querySelector("#guardar").reset();  
      $('#nuevoGasto').modal('hide'); 

     
      mostrarNotificacion("Gasto guardado exitosamente!", 'success');
    } else {
      
      mostrarNotificacion("No se pudo guardar el gasto.", 'error');
    }
  } catch (error) {
   
    console.error('Error al guardar el gasto:', error);
    mostrarNotificacion("Error al guardar el gasto. Intenta nuevamente.", 'error');
  }
};

const calcularGastoTotal = async () => {
  const response = await fetch('get_gastos.php');
  const gastos = await response.json();

  return gastos.reduce((acc, gasto) => acc + parseFloat(gasto.costo), 0);
};
let gastoslocal = [];
const mostrarGastos = async (categoriaFiltro = null) => {
  const response = await fetch('get_gastos.php');
  const gastos = await response.json();

  gastoslocal = gastos;
  let gastosFiltrados = gastos; 

  if (categoriaFiltro && categoriaFiltro !== "todos") {
    gastosFiltrados = gastos.filter(gasto => gasto.categoria === categoriaFiltro);
  }

  listasgastos.innerHTML = '';

  gastosFiltrados.forEach((gasto) => {
    const imagenCategoria = categoriaImagenes[gasto.categoria] || 'img/default.jpg';

    listasgastos.innerHTML += `
    <div class="card text-center w-50 m-auto mt-3 shadow p-2">
      <div class="row">
        <div class="col"> 
          <img src="${imagenCategoria}" alt="${gasto.categoria}" class="img-fluid" style="width: 70px; height: 70px;">
        </div>
        <div class="col">
          <span>Descripción:</span><b>${gasto.descripcion}</b><br>
          <span>Costo:</span><b>$${parseFloat(gasto.costo).toFixed(2)}</b>
        </div>
        <div class="col"> 
          <button class="btn btn-success w-75 m-auto my-2" data-bs-toggle="modal" data-bs-target="#Editar" onclick="cargarDatos(${gasto.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"/>
            </svg>
          </button>
          <button class="btn btn-success w-75 m-auto my-2" onclick="eliminar(${gasto.id})">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" fill-rule="evenodd" d="m18.412 6.5l-.801 13.617A2 2 0 0 1 15.614 22H8.386a2 2 0 0 1-1.997-1.883L5.59 6.5H3.5v-1A.5.5 0 0 1 4 5h16a.5.5 0 0 1 .5.5v1zM10 2.5h4a.5.5 0 0 1 .5.5v1h-5V3a.5.5 0 0 1 .5-.5M9 9l.5 9H11l-.4-9zm4.5 0l-.5 9h1.5l.5-9z"/></svg>
          </button>
        </div>
      </div>
    </div>
    `;
  });

  const gastadototal = gastosFiltrados.reduce((acc, gasto) => acc + parseFloat(gasto.costo), 0);
  totalGastos.innerHTML = `: $${gastadototal.toFixed(2)}`;

  const presupuestoDisponible = tpresupuesto - gastadototal;
  disponible.innerHTML = `: $${presupuestoDisponible.toFixed(2)}`;

  if (progress) {
    const porcentajeDisponible = (presupuestoDisponible / tpresupuesto) * 100;
    progress.innerHTML = `<circle-progress value='${porcentajeDisponible}' min="0" max="100" class="m-auto" text-format="percent"></circle-progress>`;
  }
};


const cargarDatos = async (id) => {
  try {

    const response = await fetch('get_gasto.php?id=' + id);
    if (!response.ok) throw new Error('Error al obtener el gasto');
    
  
    const gasto = await response.json();
    console.log('Gasto obtenido:', gasto); 

    document.getElementById("gastoIndex").value = gasto.id;
    document.getElementById("Descripcionedit").value = gasto.descripcion;
    document.getElementById("Gastosedit").value = gasto.costo;
    document.getElementById("cate2edit").value = gasto.categoria;


    $('#Editar').modal('show');
    
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar los datos para editar.',
    });
  }
};
const editar = async () => {
  const id = parseInt(document.getElementById("gastoIndex").value);
  const desc = document.getElementById("Descripcionedit").value;
  const costo = parseFloat(document.getElementById("Gastosedit").value);
  const categoria = document.getElementById("cate2edit").value;

  const gastadototal = await calcularGastoTotal();
  if (isNaN(gastadototal)) {
    mostrarNotificacion("No se pudo calcular el gasto total.", 'error');
    return;
  }

  const gastoOriginal = gastoslocal.find(g => g.id === id)?.costo || 0;
  const presupuestoDisponible = tpresupuesto - gastadototal + gastoOriginal;

  if (isNaN(costo) || costo <= 0) {
    mostrarNotificacion("Ingresa un costo válido!", 'error');
    return;
  }

  if (categoria === "todos") {
    mostrarNotificacion("SELECCIONA UNA CATEGORIA!", 'error');
    return;
  }

  if (costo > presupuestoDisponible) {
    mostrarNotificacion("El gasto actualizado supera el presupuesto disponible!", 'error');
    return;
  }

  const response = await fetch('update_gasto.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      id: id,
      descripcion: desc,
      costo: costo,
      categoria: categoria
    })
  });

  const result = await response.text();
  console.log(result);

  if (response.ok) {
    await mostrarGastos();
    $('#Editar').modal('hide');
    mostrarNotificacion("Gasto actualizado exitosamente!", 'success');
  } else {
    mostrarNotificacion("No se pudo actualizar el gasto.", 'error');
  }
};



const eliminar = async (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás recuperar este gasto después de ser eliminado!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#a0db8e',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await fetch('delete_gasto.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          id: id
        })
      });

      const resultText = await response.text();
      console.log(resultText);
      await mostrarGastos();
      Swal.fire('Eliminado!', 'El gasto ha sido eliminado.', 'success');
    }
  });
};

const reset = async () => {
  Swal.fire({
    title: '¿Estás seguro de reiniciar?',
    text: "'Los datos serán eliminados'",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#a0db8e',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await fetch('delete_all_gastos.php', {
        method: 'POST'
      });

      const resultText = await response.text();
      console.log(resultText);
      tpresupuesto = 0;

  
      localStorage.removeItem('presupuesto');

      totalpresupuesto.innerHTML = `$ 0.00`;
      totalGastos.innerHTML = `: $0.00`;
      disponible.innerHTML = `: $0.00`;
      listasgastos.innerHTML = '';

      presupuesto.value = '0';

      divPresupuesto.classList.remove("d-none");
      divGastos.classList.remove("d-block");
      divPresupuesto.classList.add("d-block");
      divGastos.classList.add("d-none");

      $('#Editar').modal('hide');
      $('#nuevoGasto').modal('hide');

      Swal.fire({
        icon: 'success',
        title: '¡Reiniciado!',
        text: 'Los datos han sido eliminados y puedes ingresar un nuevo presupuesto.',
      });
    }
  });
};



filtrar.addEventListener('change', async (event) => {
  const categoriaSeleccionada = event.target.value;
  await mostrarGastos(categoriaSeleccionada);
});
