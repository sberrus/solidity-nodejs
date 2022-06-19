const ethers = require("ethers");
const fs = require("fs");

const main = async () => {
	// http://127.0.0.1:8545 -> Ganache local server

	// Obtenemos el provider mediante ethers para poder interactuar con el nodo de pruebas.
	const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

	// privateKey de wallet local de Ganache.
	const ganacheWalletPrivateKey = "d9dcfd0584003c8851ee821183de87a96643d209aa15653f65a54157615093c8";

	// Instanciando un wallet de ethers. Pasamos la private key
	const wallet = new ethers.Wallet(ganacheWalletPrivateKey, provider);

	// Obtenemos el abi y el binary del contrato ya compilado que queremos enviar a la red.
	const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
	const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");

	// El objeto contract factory es el que nos permite realizar el deploy a la red.
	const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
	console.log("Desplegando contrato espere...");

	// Utilizamos el método deploy() que como indica, realiza el deploy del contrato a la red.
	try {
		// Si todo sale correctamente, veremos que el contrato ha sido enviado correctamente a la red y
		// contractFactory nos devuelve una instancia del contrato desplegado en la red.
		const contract = await contractFactory.deploy();
		console.log(contract);
	} catch (error) {
		console.log(error);
	}
};

// Corremos la función main asyncrona
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
