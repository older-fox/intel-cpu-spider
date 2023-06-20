import {intelCpu} from "./schema";

export const updateCpuInfo = async (id:number,info:any)=>{
    await intelCpu.updateOne({id:id},{
        $set:info
    },{upsert:true}).exec()
    //console.log(res.acknowledged)
}
