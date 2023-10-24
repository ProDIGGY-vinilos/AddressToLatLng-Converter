import ExcelJS from 'exceljs';
import { obtenerLatLong } from './geocode.js';
let address = [];
async function leerExcel(path) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);
    return workbook;
}
async function cargarAddres() {
    const workbook = await leerExcel('./CLIENT.xlsm');
    const worksheet = workbook.worksheets[0];
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            address.push({
                codigo: row.getCell('A').value,
                domicilio: (row.getCell('B').value +
                    ' ' +
                    row.getCell('C').value +
                    ' ' +
                    row.getCell('D').value +
                    ' ' +
                    row.getCell('E').value),
            });
        }
    });
}
async function transformaAddres(address) {
    for (let i = 0; i < address.length; i++) {
        const { latitud, longitud } = await obtenerLatLong(address[i].domicilio);
        if (latitud !== undefined ||
            longitud !== undefined) {
            address[i].lat = latitud;
            address[i].long = longitud;
        }
    }
    return address;
}
async function main() {
    console.log('Iniciando');
    await cargarAddres();
    await transformaAddres(address);
    console.log(address);
}
main();
//# sourceMappingURL=index.js.map