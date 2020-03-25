const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')

const {LocalStorage}=require('node-localstorage')
const localstorage=new LocalStorage('./data-reservation')

const loadReservations=()=>JSON.parse(localstorage.getItem('reservations')||'{}')
const saveReservations=reservations=>localstorage.setItem('reservaions',JSON.stringify(reservations,null,2))

const app=express()
.use(cors())
.use(bodyParser.json())
.use(bodyParser.urlencoded())
.delete('/cancel',(req,res)=>{
    const reservaions=loadReservations()
    const {showID,name}=req.body
    const reservaion=reservaions[showID].filter(reservaion=>reservaion.name!==name)
    saveReservations(reservaions)
    res.json({canceled:true,showID,...reservaion})
})
// .post('/reserveTickets',(req,res)=>{
//     const shows=loadShows()
//     const reservaions=loadReservations()
//     if(!req.body.count){
//         res.status(500);
//         return res.json({error:`A ticket is required to reserve tickets`})
//     }
//     if(!req.body.name){
//         res.status(500);
//         return res.json({error:`A name is required to reserve tickets`})
//     }
//     const count=parseInt(req.body.count)
//     show=shows.find(s=>s._id===req.body.showID)
//     if(!show){
//         res.status(500);
//         return res.json({error:`Cannot find show with showid ${req.body.showID}`})
//     }
//     const remainingSeats=show.houseSize-show.reserved
//     if(remainingSeats<count)
//     {
//         res.status(500);
//         return res.json({error:`Cannot reserve ${count} seats. Only ${remainingSeats} remaining`})
//     }
//     var list=reservaions[req.body.showID]
//     var reservaion={name:req.body.name,guests:req.body.count}
//     if(!list){
//         reservaions[req.body.showID]=[]
//     }
//     reservaions[req.body.showID].push(reservaion)
//     show.reserved+=count;
//     saveReservations(reservaions)
//     saveShows(shows)
//     res.json(show)
// })
.post('/',(req,res)=>{
    const reservaions=loadReservations()
    let count
    if(!req.body.count){
        res.status(500);
        return res.json({error:`A ticket is required to reserve tickets`})
    }
    if(!req.body.name){
        res.status(500);
        return res.json({error:`A name is required to reserve tickets`})
    }
    if(!req.body.showID){
        res.status(500);
        return res.json({error:`A showID is required to reserve tickets`})
    }
    count=parseInt(req.body.count)
    var reservaion={name:req.body.name,guests:req.body.count}
    reservaions[req.body.showID].push(reservaion)
    saveReservations(reservaions)
    res.json({success:true,showID:req.body.showID,...reservaion})
})
.get('/reservations/:showID',(req,res)=>{
    const reservaions=loadReservations()
    res.json(reservaions[req.params.showID]||[])
})
.get('/',(req,res)=>{
    const reservaions=loadReservations()
    res.json(reservaions);
    console.log("reservations returned")
})

app.listen(3002,()=>console.log("reservations service running on port 3000"))