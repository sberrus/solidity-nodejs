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

	// Realizando deploy de contrato inteligente pasando los datos a mano [Ineficiente preferible utilizar contractFactory
	//  que provee las herramientas neceasrias para realizar este proceso de manera sencilla]
	try {
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
