import "dotenv/config";
import readline from "readline";
import qrcode from "qrcode";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { NubankApi } from "nubank-api";

const NUBANK_CPF = process.env.NUBANK_CPF;
const NUBANK_PASS = process.env.NUBANK_PASS;
const NUBANK_AUTH = uuidv4();

if (!NUBANK_CPF || !NUBANK_PASS) {
    throw new Error("Nubank credentials not defined");
}

async function validateAuth(api: NubankApi) {
    const qr = await qrcode.toString(NUBANK_AUTH);

    const requestMsg =
        "Pressione qualquer tecla após validar o QR Code no App Nubank do seu celular.";

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    await new Promise((res) => rl.question(requestMsg + "\n" + qr + "\n", res));

    rl.close();

    await api.auth.authenticateWithQrCode(NUBANK_CPF, NUBANK_PASS, NUBANK_AUTH);
}

async function validateCertificate(api: NubankApi) {
    await api.auth.requestAuthenticationCode({
        cpf: NUBANK_CPF,
        password: NUBANK_PASS,
        deviceId: NUBANK_AUTH,
    });

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    const code: string = await new Promise((res) => rl.question("Codigo: ", res));

    rl.close();

    const res2 = await api.auth.exchangeCertificates({
        cpf: NUBANK_CPF,
        password: NUBANK_PASS,
        deviceId: NUBANK_AUTH,
        authCode: code,
    });

    fs.writeFileSync("./cert.p12", res2.cert);
}

async function main() {
    const api = new NubankApi();

    // await validateAuth(api);
    await validateCertificate(api);

    // await api.account.
}

main()
    .then(() => console.log("Finished"))
    .catch((err) => console.error(err));
