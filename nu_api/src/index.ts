import "dotenv/config";

const NUBANK_CPF = process.env.NUBANK_CPF;
const NUBANK_PASS = process.env.NUBANK_PASS;

if (!NUBANK_CPF || !NUBANK_PASS) {
    throw new Error("Nubank credentials not defined");
}

async function main() {}

main()
    .then(() => console.log("Finished"))
    .catch((err) => console.error(err));
