var oTabla = $("#tblEmpleados").DataTable();
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
    LlenarComboCargos();
    LlenarTabla();
});
async function LlenarTabla() {
    try {
        const Respuesta = await fetch("http://localhost:64158/api/Empleados",
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        const Rpta = await Respuesta.json();

        const Columnas = [];
        NombreColumnas = Object.keys(Rpta[0]);
        for (var i in NombreColumnas) {
            Columnas.push({
                data: NombreColumnas[i],
                title: NombreColumnas[i]
            });
        }
        for (var i = 0; i < Rpta.length; i++) {
            Rpta[i].fechaContratacion = Rpta[i].fechaContratacion.split('T')[0];
        }

        $("#tblEmpleados").DataTable({
            data: Rpta,
            columns: Columnas,
            destroy: true
        });
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}
async function LlenarComboCargos() {
     LlenarComboXServicios("http://localhost:64158/api/Cargos", "#cboCargoEmpleado", "id_cargo");
}
async function EjecutarComando(Comando) {
    let Documento = $("#txtDocumento").val();
    let Nombre = $("#txtNombre").val();
    let Apellido = $("#txtApellido").val();
    let Telefono = $("#txtTelefono").val();
    let Cargo = $("#cboCargoEmpleado").val();
    let FechaContratacion = $("#txtFechaContratacion").val();

    let DatosEmpleado = {
        documento: Documento,
        nombre: Nombre,
        apellido: Apellido,
        telefono: Telefono,
        id_cargo: Cargo,
        fecha_contratacion: FechaContratacion
    }

    try {
        const Respuesta = await fetch("http://localhost:64158/api/Empleados",
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosEmpleado)
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
    let Documento = $("#txtDocumento").val();
    $("#dvMensaje").html("");
    try {
        const Respuesta = await fetch("http://localhost:64158/api/Empleados?documento=" + Documento,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        const Resultado = await Respuesta.json();
        $("#txtNombre").val(Resultado.nombre);
        $("#txtApellido").val(Resultado.apellido);
        $("#txtTelefono").val(Resultado.telefono);
        $("#cboCargoEmpleado").val(Resultado.id_cargo);
        $("#txtFechaContratacion").val(Resultado.fecha_contratacion.split('T')[0]);
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}