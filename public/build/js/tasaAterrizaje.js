let gridOptions;function asignarEventos(){$(".aeropSearch").hide(),$(".naveSearch").hide(),document.addEventListener("keydown",a=>{"Escape"===a.key&&resetForm()}),seleccionTxt("tarifa_aterrizaje"),aplicarMascaraCantidad("tarifa_aterrizaje"),$("#tarifa_aterrizaje").on("input",(function(){$("#tarifa_aterrizaje").each((function(){let a=Number($(this).val().replace(/,/g,""));a}))})),document.getElementById("aeropuerto_id").addEventListener("mousedown",(async function(a){a.preventDefault(),$(".aeropSearch").show(),$(".inAeropSrch").focus();let e=await obtenerAeropuertos();await mostrarListaSearch(e,".aeropSearch","aeropuerto_id","municipio")})),document.getElementById("aeronave_id").addEventListener("mousedown",(async function(a){a.preventDefault(),$(".naveSearch").show(),$(".inNaveSrch").focus();let e=await obtenerAeronaves();await mostrarListaSearch(e,".naveSearch","aeronave_id","modelo")}))}function configurarBotones(){$(".contenedor-altas").hide(),$("#crear-tasa").click(mostrarContenedorAltas),$(".btn-cancelar").click(a=>{resetForm()}),$("#btnGuardar").click(a=>{validateInputs($("#formAltas"))&&(""==$("#tasa_aterrizaje_id").val()?crearTasa():actualizarTasa())})}function inicializarPagina(){iniciarTabla("",[{headerName:"id",field:"tasa_aterrizaje_id",width:80},{headerName:"Aeropuerto ",field:"nombre_aeropuerto",width:190},{headerName:"Aeronave",field:"nombre_aeronave",width:120},{headerName:"Tarifa de Aterrizaje",field:"tarifa_aterrizaje",width:160,cellStyle:{textAlign:"right"},valueFormatter:function(a){return Number(a.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",")}},{headerName:"Acción",cellRenderer:function(a){const e=document.createElement("I");e.className="fa-regular fa-pen-to-square btn btn-editar",e.title="Editar",e.addEventListener("click",(async function(){await mostrarContenedorAltas(),$("#tasa_aterrizaje_id").val(a.data.tasa_aterrizaje_id),$("#tarifa_aterrizaje").val(conComa(a.data.tarifa_aterrizaje)),$("#aeropuerto_id option").val(a.data.aeropuerto_id),$("#aeropuerto_id option").text(a.data.nombre_aeropuerto),$("#aeronave_id option").val(a.data.aeronave_id),$("#aeronave_id option").text(a.data.nombre_aeronave)}));const r=document.createElement("div");return r.classList="btn-cont centrado",r.appendChild(e),r},width:150,headerClass:"txt-center",cellClass:"custom-action-cell",filter:!1}],"#myGrid"),traeTasaAterrizaje()}function resetForm(){cerrarVentana(".contenedor-altas",["#formAltas"])}async function mostrarContenedorAltas(){$(".contenedor-altas").show(),await obtenerAeropuertos(),await obtenerAeronaves()}async function traeTasaAterrizaje(){try{const a=await fetch("allTasaAt",{method:"GET"}),e=await a.json();let r=verificarArray(e);gridApi.setGridOption("rowData",r)}catch(a){console.error(a),SwalToast("warning","Error al obtener los datos",2500)}}async function obtenerAeropuertos(){try{const a=await fetch("allAeropuertos",{method:"GET"}),e=await a.json();return!e.length>0&&SwalToast("warning","No hay Aeropuertos disponibles.",2500),e}catch(a){console.error(a),SwalLoad("error","Ocurrio Un Error","Conección Perdida a BD.",!1)}}async function obtenerAeronaves(){try{const a=await fetch("allAeronaves",{method:"GET"}),e=await a.json();return!e.length>0&&SwalToast("warning","No hay Aeronaves disponibles.",2500),e}catch(a){console.error(a),SwalLoad("error","Ocurrio Un Error","Conección Perdida a BD.",!1)}}async function crearTasa(){const a=$("#aeropuerto_id").val(),e=$("#aeronave_id").val(),r=sinComa($("#tarifa_aterrizaje").val());try{const t=new FormData;t.append("aeropuerto_id",a),t.append("aeronave_id",e),t.append("tarifa_aterrizaje",r);const o=await fetch("crear/tasaAterrizaje",{method:"POST",body:t}),n=await o.json();1==n.exito?(SwalLoad("success","Éxito","Registro Creado Correctamente",!1),setTimeout(()=>{swal.close(),resetForm(),traeTasaAterrizaje()},1500)):0==n.exito&&SwalLoad("error","Error en la Transacción",n.errorSMS,!0),n.alertas&&SwalToast("warning",n.alertas.error,2500)}catch(a){console.error(a),SwalLoad("error","Error en la Conexión","Comunicate con el Administrador",!1)}}async function actualizarTasa(){const a=$("#tasa_aterrizaje_id").val(),e=$("#aeropuerto_id").val(),r=$("#aeronave_id").val(),t=sinComa($("#tarifa_aterrizaje").val());try{const o=new FormData;o.append("tasa_aterrizaje_id",a),o.append("aeropuerto_id",e),o.append("aeronave_id",r),o.append("tarifa_aterrizaje",t);const n=await fetch("actualizar/tasaAterrizaje",{method:"POST",body:o}),i=await n.json();1==i.exito?(SwalLoad("success","Éxito","Registro Actualizado Correctamente",!1),setTimeout(()=>{swal.close(),resetForm(),traeTasaAterrizaje()},1500)):0==i.exito&&SwalLoad("error","Error en la Transacción",i.errorSMS,!0),i.alertas&&SwalToast("warning",i.alertas.error,2500)}catch(a){console.error(a),SwalLoad("error","Error en la Conexión","Comunicate con el Administrador",!1)}}$((function(){asignarEventos(),inicializarPagina(),configurarBotones()}));
//# sourceMappingURL=tasaAterrizaje.js.map
