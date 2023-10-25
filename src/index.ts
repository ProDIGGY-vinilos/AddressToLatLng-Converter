import ExcelJS from 'exceljs';
import { obtenerLatLong } from './geocode.js';

interface Address {
  codigo: number;
  domicilio: string;
  lat?: number;
  long?: number;
  location_type?: string;
}

let address: Address[] = [];

async function leerExcel(path: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path);
  return workbook;
}

async function cargarAddres() {
  const workbook = await leerExcel(process.env.EXCEL_URL);
  const worksheet = workbook.worksheets[0];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      address.push({
        codigo: row.getCell('A').value as number,
        domicilio: (row.getCell('B').value +
          ' ' +
          row.getCell('C').value +
          ' ' +
          row.getCell('D').value +
          ' ' +
          row.getCell('E').value) as string,
      });
    }

  });
}

async function transformaAddres(address: Address[]) {
  for (let i = 0; i < address.length; i++) {
    const { latitud, longitud, location_type } =
      await obtenerLatLong(address[i].domicilio);
    if (
      latitud !== undefined ||
      longitud !== undefined
    ) {
      address[i].lat = latitud;
      address[i].long = longitud;
      address[i].location_type = location_type;
    }
  }
  return address;
}

function createExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ClientsWithLatLong';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastModifiedBy = 'ProDIGGY-vinilos';
  workbook.lastPrinted = new Date();
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.properties.date1904 = true;
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible',
    },
  ];
  const worksheet = workbook.addWorksheet('Clientes');
  worksheet.columns = [
    { header: 'Codigo', key: 'cod', width: 10 },
    { header: 'Domicilio', key: 'dom', width: 50 },
    { header: 'Latitud', key: 'lat', width: 10 },
    { header: 'Longitud', key: 'long', width: 10 },
    { header: 'Location Type', key: 'location_type', width: 20}
  ];
  return workbook;
}

async function escribirExcel(address: Address[]) {
  const workbook = createExcel();
  const worksheet = workbook.worksheets[0];
  address.forEach((addres) => {
    worksheet.addRow({
      cod: addres.codigo,
      dom: addres.domicilio,
      lat: addres.lat,
      long: addres.long,
      location_type: addres.location_type
    });
  });
  const result = await workbook.xlsx.writeFile('Clientes.xlsx');
console.log(result);

}

async function main() {
  console.log('Iniciando');
  await cargarAddres();
  await transformaAddres(address);
  console.log(address.length);
  await escribirExcel(address);
}

main();
