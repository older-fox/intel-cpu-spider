import got from 'got'

const main = async ()=>{
    for (let i = 134584; i < 10000000; i++) {
        try {
            const res= await got.get(`https://ark.intel.com/content/www/us/en/ark/products/${i}`,{
                headers:{
                    'User-Agent': 'my-custom-user-agent',
                }
            })
            console.log(res)
        }catch (e:any) {
            console.log(e)
        }
    }
}

main().then()