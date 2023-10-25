import ExcelJS from 'exceljs';
import { obtenerLatLong } from './geocode.js';
import { time } from 'console';

interface Address {
  codigo: number;
  domicilio: string;
  lat?: number;
  long?: number;
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
    const { latitud, longitud } =
      await obtenerLatLong(address[i].domicilio);
    if (
      latitud !== undefined ||
      longitud !== undefined
    ) {
      address[i].lat = latitud;
      address[i].long = longitud;
    }
    console.log(address[i]);
    
  }
  return address;
}

async function main() {
  console.log('Iniciando');
  await cargarAddres();
  await transformaAddres(address);
  console.log(address.length);
}

main();
