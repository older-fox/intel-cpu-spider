import {WebSocket} from 'ws'

const main = async ()=>{
    const wss = new WebSocket('ws://218.29.54.120:59892')
    wss.on('open',()=>{
        console.log('opened')
    })
    wss.on('message',(msg)=>{
        console.log(msg.toString())
    })
}