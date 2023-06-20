import {connectToMongoDB, testMongoConnection} from "./src/database";
import config from "./src/config";
import { scanIntelChip} from "./src/spider/intel/information";

const main = async ()=>{
    await testMongoConnection(<string>config.get('database.url'))
    await connectToMongoDB(<string>config.get('database.url'))
    await scanIntelChip ()
}

main().then()