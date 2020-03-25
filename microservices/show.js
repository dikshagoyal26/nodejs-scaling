//pm2 start show.js -i 4
const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')

const {LocalStorage}=require('node-localstorage')
const localstorage=new LocalStorage('./data-shows')

const loadShows=()=> JSON.parse(localstorage.getItem('shows')||'[]')
const saveShows=shows=> localstorage.setItem('shows',JSON.stringify(shows,null,2))

const app=express()
.use(cors())
.use(bodyParser.json())
.use(bodyParser.urlencoded())
.put('/release-seats',(req,res)=>{
    let show,count,shows=loadShows();
    if(!req.body.showID||!req.body.count){
        res.status(500);
        return res.json({error:'A showID and count are required to release seats'})
    }
    count =parseInt(req.body.count)
    show=shows.find(s=>s._id===req.body.showID)
    if(!show){
        res.status(500);
        return res.json({error:`Cannot find show with showid ${req.body.showID}`})
    }
    show.reserved-=count;
    if(show.reserved<0)
    {
        show.reserved=0;
    }
    saveShows(shows)
    res.json(show)
})
.put('/hold-seats',(req,res)=>{
    let show,count,shows=loadShows();
    if(!req.body.showID||!req.body.count){
        res.status(500);
        return res.json({error:'A showID and count are required to release seats'})
    }
    count =parseInt(req.body.count)
    show=shows.find(s=>s._id===req.body.showID)
    if(!show){
        res.status(500);
        return res.json({error:`Cannot find show with showid ${req.body.showID}`})
    }
    const remainingSeats=show.houseSize-show.reserved
    if(remainingSeats<count)
    {
        res.status(500);
        return res.json({error:`Cannot reserve ${count} seats. Only ${remainingSeats} remaining`})
    }
    show.reserved+=count;
    saveShows(shows)
    res.json(show)
})

.get('/show/:id',(req,res)=>{
    const shows=loadShows()
    const show=shows.find(show=>show._id===req.params.id)
    res.json(show)
    console.log(`delivered show ${show.name}`)
})
.get('/',(req,res)=>{
    const shows=loadShows()
    res.json(shows);
    console.log("shows returned")
})

app.listen(3001,()=>console.log("show service running on port 3000"))