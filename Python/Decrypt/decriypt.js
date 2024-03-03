import Cryptr from "cryptr";
import 'dotenv/config'
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);

console.log(cryptr.decrypt(process.argv[2]))