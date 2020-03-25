const {LocalStorage}=require('node-localstorage')
const dbA=new LocalStorage('data-a-m')
const dbB=new LocalStorage('data-m-z')

const whichDB=name=> name.match(/^[A-M]|^[a-m]/) ? dbA:dbB

const LoadCats=(db)=> JSON.parse(db.getItem('cats')||'[]')

const hasCat=(name)=> LoadCats(whichDB(name)).map(cat=>cat.name).includes(name)

const addCat=newCat=>{
    if(!hasCat(newCat.name)){
        let db=whichDB(newCat.name)
        let cats=LoadCats(db)
        cats.push(newCat)
        db.setItem("cats",JSON.stringify(cats,null,2))
    }
}
const findCatByName=name=>{
    let cats=LoadCats(whichDB(name))
    return cats.find(cat=>cat.name===name)
}
const findCatByColor=color=>{
   return [
        ...LoadCats(dbA).filter(cat=>cat.color===color),
        ...LoadCats(dbB).filter(cat=>cat.color===color)
    ]
    // let cats=LoadCats()
    // return cats.find(cat=>cat.color===color)
}
module.exports={
    addCat,findCatByName,findCatByColor
}