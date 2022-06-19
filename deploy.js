const ethers = require("ethers");
const fs = require("fs");

const main = async () => {
	// http://127.0.0.1:8545 -> Ganache local server

	// Obtenemos el provider mediante ethers para poder interactuar con el nodo de pruebas.
	const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

	// privateKey de wallet local de Ganache.
	const ganacheWalletPrivateKey = "5602bbc0403c001b84e792d62419d44badc67ad6b36ef960a78d7567fb809bfc";

	// Instanciando un wallet de ethers. Pasamos la private key
	const wallet = new ethers.Wallet(ganacheWalletPrivateKey, provider);

	// Obtenemos el abi y el binary del contrato ya compilado que queremos enviar a la red.
	const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
	const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");

	// El objeto contract factory es el que nos permite realizar el deploy a la red.
	const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
	console.log("Desplegando contrato espere...");

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
		console.log(contractFavoriteNumber);
	} catch (error) {
		throw new Error(error);
	}
};

// Corremos la función main asyncrona
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
