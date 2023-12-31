import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function obtenerLatLong(
	address: string
): Promise<{ latitud: number; longitud: number; location_type: string }> {
	const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.APIKEY}`;
	const response = await axios.get(url);
	console.log(
		`${response.data.status} para ${address} con response ${response.data.results.length}` //! BORRAR CUANDO ESTE TODO OK
	);
	if (response.data.status !== "OK") {
		if (response.data.status === "ZERO_RESULTS") {
			return { latitud: 0, longitud: 0, location_type: "ZERO_RESULTS" };
		} else {
			throw new Error(
				`Error al obtener latitud y longitud para ${address}`
			);
		}
	} else {
		const { lat, lng } = response.data.results[0].geometry.location;
		const location_type = response.data.results[0].geometry.location_type;
		return { latitud: lat, longitud: lng, location_type };
	}
}
