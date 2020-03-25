//"loadtest -n 300 http://localhost:3000" to test load for 300 requests

const http=require('http')
const cluster=require('cluster')
const cpus=require('os').cpus().length;
if(cluster.isMaster){
    console.log("this is a master process: ",process.pid)
    for(let i=0;i<cpus;i++)
    {
        cluster.fork()
    }

    //will be raised when any worker process dies
    cluster.on('exit',worker=>{
        console.log(`worker ${process.pid} had died`)
        console.log(`only ${Object.keys(cluster.workers).length} remaining` )
        console.log("starting new worker")
        cluster.fork() //zero downtime
    })
}
else{
    console.log("started a worker at : ",process.pid)
    http.createServer((req,res)=>{
        res.end(`process : ${process.pid}`)
        if(req.url==='/kill'){
            process.exit()
        }
        else if(req.url==='/'){
            console.log(`Serving from ${process.pid}...`)
        }
    }).listen(3000)
}

