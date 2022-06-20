const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

/**
 * Script para encryptar información con ethers
 *
 * el wallet de ethers nos permite encriptar información tomando en cuenta protocolos de seguridad
 * que nos provee ethers con los datos de la account que pasemos como llave privada.
 *
 * Este escript nos puede ayudar para que podamos crear un archivo encryptado de manera que nos de una capa extra de seguridad
 * a la hora de estar trabajando con información sensible de la blockchain.
 *
 * En este caso lo utilizaremos para encryptar la privatekey de la cuenta con la que estemos trabajando para poder mandar estos
 * datos a github o cualquier servicio de almacenamiento de repositorios sin miedo a que nuestros datos puedan quedar expuestos
 * en internat.
 */

const main = async () => {
	// Instanciamos un objeto wallet con el private key que vamos a encriptar. Esto nos da una capa de seguridad ya que para acceder correctamente a
	// los datos de encriptación necesitaremos de antemano la private_key que encripto la información.
	const wallet = new ethers.Wallet(process.env.SENDER_PRIVATE_KEY);

	// la instancia de wallet con la private key nos provee un método que encripta los datos que querramos pasar pasando como primer arguento
	// el salt del encriptado para agregarle otra capa de seguridad y luego los datos que queremos encriptar.
	const encryptedJsonKey = await wallet.encrypt(process.env.PRIVATE_KEY_SALT, process.env.SENDER_PRIVATE_KEY);

	// Luego este proceso nos devuelve un json con la encriptación y la inforación encryptada para que esta pueda ser almacenada con más seguridad a la red.
	console.log(encryptedJsonKey); // -> json con la encriptación

	// Almacenamos el json con los datos encriptados en un archivo json y este archivo es el que utilizamos en el script de deploy.js para poder acceder a la private_key
	// que deseamos usar.
	console.log("\n -- Documento Encriptado -- \n");
	fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
};

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});

/**
 * INSTRUCCIONES DE USO:
 *
 * 1-   Primero debemos configurar las variables de entorno en nuestro archivo .env especificando allí la PRIVATE_KEY que queremos encryptar y luego el SALT
 * que será utilizado en el encriptado.
 *
 * 2-   Corremos el script y esperamos que genere el .encryptedKey.json
 *
 * 3-   Borramos las variables PRIVATE_KEY y SALT del archivo .env
 *
 * 4-   Ya podemos relizar los deploys a github con tranquilidad sin tener miedo a que la private_key quede expuesta.
 */
