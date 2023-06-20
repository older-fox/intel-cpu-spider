import mongoose, {Error, mongo} from 'mongoose'

export const testMongoConnection = async (url:string) => {
    const jobs = []


    jobs.push(new Promise<string>(async resolve => {
        await mongoose.connect(url,{
            bufferCommands:false
        })
        await mongoose.disconnect()
        resolve('ok')
    }))

    jobs.push(new Promise((resolve, reject) => {
        setTimeout(()=>{
            reject(new Error('Connect to mongodb timed out'))
        },3000)
    }))
    await Promise.race(jobs)
}


export const connectToMongoDB = async (url:string) => {
    const jobs = []


    jobs.push(new Promise<string>(async resolve => {
        await mongoose.connect(url,{
            bufferCommands:false
        })
        resolve('ok')
    }))

    jobs.push(new Promise((resolve, reject) => {
        setTimeout(()=>{
            reject(new Error('Connect to mongodb timed out'))
        },3000)
    }))
    await Promise.race(jobs)
}