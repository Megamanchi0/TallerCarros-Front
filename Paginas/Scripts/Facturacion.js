jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    $("#btnGrabarProducto").on("click", function () {
        GrabarProducto();
    });
    $("#btnGrabarReparacion").on("click", function () {
        GrabarReparacion();
    });
    $("#btnGrabarServicio").on("click", function () {
        GrabarServicio();
    });
    $("#btnGrabarfactura").on("click", function () {
        GrabarFactura();
    });
    $("#txtNumeroFactura").val("0");
    LlenarComboTipoProducto();
    LlenarComboTipoReparacion();
    LlenarComboServicios();

});

function LlenarTablaProductos() {
    let IdFactura = $("#txtIdFactura").val();
    LlenarTablaXServicios("http://localhost:58511/api/Facturacion/LlenarTablaReparaciones?IdFactura=" + IdFactura, "#tblReparaciones");
}
function LlenarTablaReparaciones() {
    let IdFactura = $("#txtIdFactura").val();
    LlenarTablaXServicios("http://localhost:58511/api/Facturacion/LlenarTablaProductos?IdFactura=" + IdFactura, "#tblProductos");
}
function LlenarTablaServicios() {
    let IdFactura = $("#txtIdFactura").val();
    LlenarTablaXServicios("http://localhost:58511/api/Facturacion/LlenarTablaServicios?IdFactura=" + IdFactura, "#tblServicios");
}

async function LlenarComboTipoProducto() {
    let rpta = await LlenarComboXServicios("http://localhost:58511/api/TipoProductos", "#cboTipoProducto");
    LlenarComboProducto();
}
async function LlenarComboTipoReparacion() {
    let rpta = await LlenarComboXServicios("http://localhost:58511/api/TipoReparaciones", "#cboTipoReparacion");
    LlenarComboReparaciones();
}

async function LlenarComboProducto() {
    let idTipoProducto = $("#cboTipoProducto").val();
    let rpta = await LlenarComboXServicios("http://localhost:58511/api/Productos?idTipoProducto=" + idTipoProducto, "#cboProducto");
}
async function LlenarComboReparaciones() {
    let idTipoReparacion = $("#cboTipoReparacion").val();
    let rpta = await LlenarComboXServicios("http://localhost:58511/api/Reparaciones/LlenarCombo?idTipoReparacion=" + idTipoReparacion, "#cboReparaciones");
}
async function LlenarComboServicios() {
    let rpta = await LlenarComboXServicios("http://localhost:58511/api/ServiciosAdicionales", "#cboReparaciones");
}

function PresentarValorUnitarioProducto() {
    let DatosProducto = $("#cboProducto").val();
    let IdProducto = DatosProducto.split('|')[0];
    let Precio = DatosProducto.split('|')[1];

    $("#txtPrecioProducto").val(FormatoMiles(Precio));
    $("#txtCodigoProducto").val(IdProducto);
}

function PresentarValorReparacion() {
    let DatosReparacion = $("#cboReparaciones").val();
    let IdReparacion = DatosReparacion.split('|')[0];
    let Costo = DatosReparacion.split('|')[1];

    $("#txtPrecioProducto").val(FormatoMiles(Costo));
    $("#txtCodigoProducto").val(IdReparacion);
}

function PresentarValorServicio() {
    let DatosServicio = $("#cboServicios").val();
    let IdServicio = DatosServicio.split('|')[0];
    let Precio = DatosServicio.split('|')[1];

    $("#txtCostoServicio").val(FormatoMiles(Precio));
    $("#txtIdServicio").val(IdServicio);
}

async function GrabarProducto() {
    let IdFactura = $("#txtIdFactura").val();
    let IdProducto = $("#txtIdProducto").val();
    let Cantidad = $("#txtCantidad").val();
    let Precio = $("#txtPrecio").val();

    let DatosFactura = {
        id_factura: IdFactura
    }

    if (IdFactura == 0) {
        try {
            const Respuesta = await fetch("http://localhost:58511/api/Facturacion/GrabarDatosFactura",
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DatosFactura)
                });
            const Resultado = await Respuesta.json();
            IdFactura = Resultado;
            $("#txtIdFactura").val(IdFactura);
        }
        catch (_error) {
            $("#dvMensaje").html(_error);
        }
    }
    let DatosDetalleFacturaProducto = {
        id_factura: IdFactura,
        id_producto: IdProducto,
        cantidad: Cantidad,
        valorUnitario: Precio
    }
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Facturacion/GrabarDetalleProducto",
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(DatosDetalleFacturaProducto)
            });
        const Resultado = await Respuesta.json();
        LlenarTablaProductos();
    }
    catch (_error) {
        $("#dvMensaje").html(_error);
    }
}

async function GrabarReparacion() {
    let PlacaVehiculo = $("#txtPlaca").val();
    let IdReparacion = $("#txtIdReparacion").val();
    let FechaReparacion = $("#txtFechaReparacion").val();

    let IdFactura = $("#txtIdFactura").val();
    let Costo = $("#txtCostoReparacion").val();

    let DatosFactura = {
        id_factura: IdFactura
    }

    if (IdFactura == 0) {
        try {
            const Respuesta = await fetch("http://localhost:58511/api/Facturacion/GrabarDatosFactura",
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DatosFactura)
                });
            const Resultado = await Respuesta.json();
            IdFactura = Resultado;
            $("#txtIdFactura").val(IdFactura);
        }
        catch (_error) {
            $("#dvMensaje").html(_error);
        }
    }
    let DatosDetalleVehiculoReparacion = {
        id_vehiculo: PlacaVehiculo,
        id_reparacion: IdReparacion,
        fecha_reparacion: FechaReparacion
    }
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Reparaciones/GrabarVehiculoReparacion",
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(DatosDetalleVehiculoReparacion)
            });
        const Resultado = await Respuesta.json();
    }
    catch (_error) {
        $("#dvMensaje").html(_error);
    }
    let DatosDetalleFacturaReparacion = {
        id_factura: IdFactura,
        id_reparacion: IdReparacion,
        costo: Costo
    }
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Facturacion/GrabarDetalleReparacion",
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(DatosDetalleFacturaReparacion)
            });
        const Resultado = await Respuesta.json();
        LlenarTablaReparaciones();
    }
    catch (_error) {
        $("#dvMensaje").html(_error);
    }
}

async function GrabarServicio() {
    let PlacaVehiculo = $("#txtPlacaS").val();
    let IdServicio = $("#txtIdServicio").val();
    let FechaServicio = $("#txtFechaServicio").val();

    let IdFactura = $("#txtIdFactura").val();
    let Precio = $("#txtCostoServicio").val();

    let DatosFactura = {
        id_factura: IdFactura
    }

    if (IdFactura == 0) {
        try {
            const Respuesta = await fetch("http://localhost:58511/api/Facturacion/GrabarDatosFactura",
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DatosFactura)
                });
            const Resultado = await Respuesta.json();
            IdFactura = Resultado;
            $("#txtIdFactura").val(IdFactura);
        }
        catch (_error) {
            $("#dvMensaje").html(_error);
        }
    }
    let DatosDetalleVehiculoServicio = {
        id_vehiculo: PlacaVehiculo,
        id_servicio: IdServicio,
        fecha_servicio: FechaServicio
    }
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Servicios/GrabarVehiculoServicio",
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(DatosDetalleVehiculoServicio)
            });
        const Resultado = await Respuesta.json();
    }
    catch (_error) {
        $("#dvMensaje").html(_error);
    }
    let DatosDetalleFacturaServicio = {
        id_servicio: IdServicio,
        id_factura: IdFactura,
        precio: Precio
    }
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Facturacion/GrabarDetalleServicio",
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(DatosDetalleFacturaServicio)
            });
        const Resultado = await Respuesta.json();
        LlenarTablaServicios();
    }
    catch (_error) {
        $("#dvMensaje").html(_error);
    }
}

async function EliminarDetalleProducto(idDetalleFacturaProducto) {
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Facturacion/EliminarDetalleProducto?idFacturaProducto=" + idDetalleFacturaProducto,
            {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        const Resultado = await Respuesta.json();
        LlenarTablaProductos();
    }
    catch (_error) {
        $("#dvMensaje").html(_error);
    }
}
async function EliminarDetalleReparacion(idDetalleFacturaReparacion) {
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Facturacion/EliminarDetalleReparacion?idFacturaReparacion=" + idDetalleFacturaReparacion,
            {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        const Resultado = await Respuesta.json();
        LlenarTablaReparaciones();
    }
    catch (_error) {
        $("#dvMensaje").html(_error);
    }
}

async function EliminarDetalleServicio(idDetalleFacturaServicio) {
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Facturacion/EliminarDetalleServicio?idFacturaServicio=" + idDetalleFacturaServicio,
            {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        const Resultado = await Respuesta.json();
        LlenarTablaServicios();
    }
    catch (_error) {
        $("#dvMensaje").html(_error);
    }
}
function GrabarFactura() {
    location.reload();
    $("#txtNumeroFactura").val("0");
    $("#txtDocumento").val("");
    $("#txtNombreCliente").val("");
    var table = new DataTable('#tblFactura');
    table.clear().draw();
}