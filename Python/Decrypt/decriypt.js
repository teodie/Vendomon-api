import Cryptr from "cryptr";
import 'dotenv/config'
const cryptr = new Cryptr("ThisIsTheKey_09");

console.log(cryptr.decrypt(process.argv[2]))