import {getIntelCpuInformation} from "./intel/information";
import {resolve} from "path";

export const processModelList = async (list:string []) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i].startsWith('Intel')){
            let model = list[i].replace("Intel Xeon ",'')
            model = model.replace('Intel Core ','')
            model = model.replace('Intel Celeron ','')
            model = model.replace('Intel Pentium ','')
            model = model.replace('Intel Core2 Duo ','')
            model = model.replace('Intel Core2 Extreme ','')
            model = model.replace('Intel Atom ','')
            model = model.replace('Intel Core2 Quad ','')
            model = model.replace('Intel CoreT ','')
            console.log(model)
            await getIntelCpuInformation(model)
            await new Promise<void>((resolve)=>{
                setTimeout(()=>{
                    resolve()
                },13333333)
            })
        }
    }
}