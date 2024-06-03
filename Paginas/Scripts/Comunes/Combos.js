async function LlenarComboXServicios(URLServicio, ComboLlenar, id) {

    try {
        const Respuesta = await fetch(URLServicio,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        const Rpta = await Respuesta.json();
        $(ComboLlenar).empty();
        for (i = 0; i < Rpta.length; i++) {
            $(ComboLlenar).append('<option value=' + Rpta[i][id] + '>' + Rpta[i].nombre + '</option>');
        }
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}