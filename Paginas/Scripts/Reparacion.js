var oTabla = $("#tblReparaciones").DataTable();
jQuery(function () {

    $("#dvMenu").load("../Paginas/Menu.html");
    $("#btnInsertar").on("click", function () {
        Insertar("POST");
    });
    $("#btnActualizar").on("click", function () {
        EjecutarComando("PUT");
    });
    $("#btnEliminar").on("click", function () {
        EjecutarComando("DELETE");
    });
    $("#btnConsultar").on("click", function () {
        Consultar();
    });

    $("#txtId").change(function () {
        bloquearInputs();
    })

    LlenarComboTipoReparacion();
    LlenarTabla();
});
async function LlenarTabla() {
    try {
        const Respuesta = await fetch("http://localhost:64158/api/Reparaciones",
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        let Rpta = await Respuesta.json();

        const Columnas = [];
        NombreColumnas = Object.keys(Rpta[0]);
        for (var i in NombreColumnas) {
            Columnas.push({
                data: NombreColumnas[i],
                title: NombreColumnas[i]
            });
        }
        for (var i = 0; i < Rpta.length; i++) {
            Rpta[i].fecha_reparacion = Rpta[i].fecha_reparacion.split('T')[0];
        }
        

        $(tblReparaciones).DataTable({
            data: Rpta,
            columns: Columnas,
            destroy: true
        });
    }
    catch (error) {

        $("#dvMensaje").html(error);
    }
}
async function LlenarComboTipoReparacion() {
    LlenarComboXServicios("http://localhost:64158/api/TipoReparaciones", "#cboTipoReparacion", "id_tipo_reparacion", "nombre");
}
async function EjecutarComando(Comando) {
    let IdReparacion = $("#txtId").val();
    let Placa = $("#txtPlaca").val();
    let TipoReparacion = $("#cboTipoReparacion").val();
    let FechaReparacion = $("#txtFechaReparacion").val();
    let CostoReparacion = $("#txtCosto").val();
    let Descripcion = $("#txtDescripcion").val();

    let DatosReparacion = {
        id_reparacion: IdReparacion,
        id_tipo_reparacion: TipoReparacion,
        descripcion: Descripcion,
        fecha_reparacion: FechaReparacion,
        costo_reparacion: CostoReparacion,
        id_vehiculo: Placa
    }

    try {
        const Respuesta = await fetch("http://localhost:64158/api/Reparaciones",
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosReparacion)
            });
        const Resultado = await Respuesta.json();
        LlenarTabla();
        $("#dvMensaje").html(Resultado);
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}
async function Insertar(){
    let IdReparacion = $("#txtId").val();
    let Placa = $("#txtPlaca").val();
    let TipoReparacion = $("#cboTipoReparacion").val();
    let FechaReparacion = $("#txtFechaReparacion").val();
    let CostoReparacion = $("#txtCosto").val();
    let Descripcion = $("#txtDescripcion").val();

    let DatosReparacion = {
        id_tipo_reparacion: TipoReparacion,
        descripcion: Descripcion,
        fecha_reparacion: FechaReparacion,
        costo_reparacion: CostoReparacion,
        id_vehiculo: Placa
    }

    try {
        const Respuesta = await fetch("http://localhost:64158/api/Reparaciones",
            {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosReparacion)
            });
        const Resultado = await Respuesta.json();
        LlenarTabla();
        $("#dvMensaje").html(Resultado);
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}
async function Consultar() {
    let IdReparacion = $("#txtId").val();
    $("#dvMensaje").html("");
    try {
        const Respuesta = await fetch("http://localhost:64158/api/Reparaciones?id=" + IdReparacion,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        const Resultado = await Respuesta.json();
        $("#txtPlaca").val(Resultado.id_vehiculo);
        $("#cboTipoReparacion").val(Resultado.id_tipo_reparacion);
        $("#txtFechaReparacion").val(Resultado.fecha_reparacion.split('T')[0]);
        $("#txtCosto").val(Resultado.costo_reparacion);
        $("#txtDescripcion").val(Resultado.descripcion);
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}

function bloquearInputs() {
    if ($("#txtId").val() != "") {
        $(".bloquear").prop('readonly', 'true');
        $(".bloquear").val('');
        $("#cboTipoReparacion").prop('disabled', 'disabled');
    } else {
        $(".bloquear").removeAttr('readonly');
        $("#cboTipoReparacion").removeAttr('disabled');
    }
}