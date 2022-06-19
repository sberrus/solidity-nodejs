const main = async () => {
	// http://127.0.0.1:8545 -> Ganache local server
};

// Corremos la función main asyncrona
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
