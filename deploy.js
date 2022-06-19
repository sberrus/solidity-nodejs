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

	// Utilizamos el método deploy() que como indica, realiza el deploy del contrato a la red.
	try {
		// // Si todo sale correctamente, veremos que el contrato ha sido enviado correctamente a la red y
		// // contractFactory nos devuelve una instancia del contrato desplegado en la red.
		// const contract = await contractFactory.deploy();

		// // Podemos configurar que se de por válido el deploy tomando en cuenta la cantidad de bloques que se han validado.
		// // Con esta línea de código estamos indicando que espere que mínimo se confirme la transacción en un bloque antes de darla por válida.
		// const deploymentReceipt = await contract.deployTransaction.wait(1);
		console.log("lets deploy with only transaction data!");
		const nonce = await wallet.getTransactionCount();
		const tx = {
			// nonce es el recuento de transacciones que tiene una wallet. Esto se usa como prevención para comprobar que no se esta enviando
			// por error 2 veces la misma transacción.
			// Si llegase a pasar, daría un error debido a que los nonce no coincidirián y una de las transacciones fallaría.
			//
			nonce,
			gasPrice: 20000000000,
			// El gas limit nos permite poner un tope de gas a una transacción. De manera que podamos controlar que no se nos
			// vaya de presupuesto realizar alguna transacción por su gas.
			gasLimit: 1000000,
			// hashcode del contrato o wallet receiver
			to: null,
			// wei que se va a enviar
			value: 0,
			// bin del contrato que quermeos desplegar a la red
			data: null,
			chainId: 1337,
		};

		const sentTxResponse = await wallet.sendTransaction(tx);
		sentTxResponse.wait(1);
		console.log(sentTxResponse);
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
