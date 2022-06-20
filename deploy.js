const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

const main = async () => {
	// http://127.0.0.1:8545 -> Ganache local server

	// Obtenemos el provider mediante ethers para poder interactuar con el nodo de pruebas.
	const provider = new ethers.providers.JsonRpcProvider(process.env.RPCProvider);

	// privateKey de wallet local de Ganache.
	const ganacheSenderPrivateKey = process.env.SenderPrivateKey;
	/*								 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
									 CADA VEZ QUE SE REINICIE EL SERVIDOR DE GANACHE, HAY QUE MODIFICAR LA
									 PRIVATE KEY DEL SENDER.
	*/

	// Instanciando un wallet de ethers. Pasamos la private key
	const wallet = new ethers.Wallet(ganacheSenderPrivateKey, provider);

	// Obtenemos el abi y el binary del contrato ya compilado que queremos enviar a la red.
	const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
	const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");

	// El objeto contract factory es el que nos permite realizar el deploy a la red.
	const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
	console.log("Desplegando contrato espere... ⏳");

	try {
		// Utilizamos el método deploy() que como indica, realiza el deploy del contrato a la red.

		// Si todo sale correctamente, veremos que el contrato ha sido enviado correctamente a la red y
		// contractFactory nos devuelve una instancia del contrato desplegado en la red.
		const contract = await contractFactory.deploy();

		// Podemos configurar que se de por válido el deploy tomando en cuenta la cantidad de bloques que se han validado.
		// Con esta línea de código estamos indicando que espere que mínimo se confirme la transacción en un bloque antes de darla por válida.
		await contract.deployTransaction.wait(1);

		// Ya estando el contrato en la red, la instancia "contract" contiene los métodos y variables que tiene el contrato
		// Por lo que podemos utilizar sus métodos ya que el ABI le dice que cosas deben comportarse de cierta manera.
		const contractFavoriteNumber = await contract.retrieves();
		console.log({
			msg: "Respuesta en formato plano",
			res: contractFavoriteNumber,
		}); // -> BigNumber { _hex: '0x00', _isBigNumber: true }

		/**
		 * BIG NUMBERS:
		 * Javascript tiene una limitación a la hora de trabajar con números muy grandes. Sin entrar en aspcetos muy técnicos podriamos decir que con
		 * los números de javascript, solo podriamos llegar hasta ~0.0009 wei que es el número que alcanzaría el Number.MAX_SAFE_INTEGER.
		 * Como los wei son números 1 * 1e18 debemos utilizar una libreria que ya incluye ethers que nos ayuda a trabajar con las respuestas
		 * hex que nos devuelven ciertos valores de solidity.
		 *
		 * Una de las formas que tenemos para poder acceder a el número en formato numerico es utilizar el método .toString() en la respuesta del contrato.
		 */

		console.log({
			msg: "Respuesta con .toString()",
			res: contractFavoriteNumber.toString(),
		}); // -> BigNumber { _hex: '0x00', _isBigNumber: true }

		/**
		 * LLAMANDO A FUNCIONES DEL CONTRATO.
		 * Al igual que podemos acceder a las variables públicas del contrato como propiedades de la instancia del mismo, también podemos llamar a sus
		 * funciones de la siguiente manera:
		 */
		console.log("Actualizando favorite number del contrato... ⏳");
		const transactionResponse = await contract.store("1225");
		/**												  ^^^^
		 * 												  Como se puede observar aquí, se envia en formato string por el mismo problema
		 * 												  de los bignumbers que hemos mencionado anteriormente.
		 */
		const transactionReceipt = await transactionResponse.wait(1); // Esperamos que la transacción se confirme en almenos 1 bloque antes de validarla.
		console.log("Contrato actualizado con exito ✅");
		const updatedFavoriteNumber = await contract.retrieves();
		console.log(`El número favorito actual de este contrato es: ${updatedFavoriteNumber}`);
	} catch (error) {
		error.code === "SERVER_ERROR" &&
			console.log(
				"Error al realizar deploy.\n\n Si esta intentando realizar el deploy en una red de pruebas compruebe la private key del sender y que el servidor este en marcha \n\n"
			);
	}
};

// Corremos la función main asyncrona
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
