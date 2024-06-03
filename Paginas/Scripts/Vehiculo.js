var oTabla = $("#tblVehiculos").DataTable();
jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    $("#btnInsertar").on("click", function () {
        EjecutarComando("POST");
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
    LlenarComboTipoVehiculos();
    LlenarTabla();
});
async function LlenarTabla() {
    LlenarTablaXServicios("http://localhost:64158/api/Vehiculos", "#tblVehiculos", "id_tipo_vehiculo");
}
async function LlenarComboTipoVehiculos() {
    LlenarComboXServicios("http://localhost:64158/api/TipoVehiculos", "#cboTipoVehiculo", "id_tipo_vehiculo", "nombre");
}
async function EjecutarComando(Comando) {
    let Placa = $("#txtPlaca").val();
    let TipoVehiculo = $("#cboTipoVehiculo").val();
    let Documento = $("#txtDocumento").val();
    let Modelo = $("#txtModelo").val();

    let DatosVehiculo = {
        id_vehiculo: Placa,
        id_tipo_vehiculo: TipoVehiculo,
        documento_cliente: Documento,
        modelo: Modelo
    }

    try {
        const Respuesta = await fetch("http://localhost:64158/api/Vehiculos",
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosVehiculo)
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
    let Placa = $("#txtPlaca").val();
    $("#dvMensaje").html("");
    try {
        const Respuesta = await fetch("http://localhost:64158/api/Vehiculos?id=" + Placa,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        const Resultado = await Respuesta.json();
        $("#cboTipoVehiculo").val(Resultado.id_tipo_vehiculo);
        $("#txtDocumento").val(Resultado.documento_cliente);
        $("#txtModelo").val(Resultado.modelo);
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}