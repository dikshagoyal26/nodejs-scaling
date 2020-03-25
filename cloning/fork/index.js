const {fork}=require('child_process')
const process=[
    fork('./app',['3001']),
    fork('./app',['3002']),
    fork('./app',['3003'])
]
console.log(`forked ${process.length} process`)