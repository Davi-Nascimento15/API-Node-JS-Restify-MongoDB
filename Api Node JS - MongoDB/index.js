const { version } = require('os')
const restify = require('restify')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://davi:Davi-1998@escola-api.reetv.mongodb.net/?retryWrites=true&w=majority')
.then(
    _=>{
        
//Criar servidor
const server = restify.createServer({
    name:'resty_api',
    version:'1.0.0',

})

//Ouve a porta 8080
server.listen(8080, ()=>{
    console.log('api acessível na porta 8080')
})

server.use(restify.plugins.bodyParser())

//Hello Word
server.get('/hello',(req,resp,next)=>{
    resp.json({message:'World'})
})


///Schema documento
const alunoSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

//Model
const Aluno = mongoose.model('Aluno',alunoSchema)

///Lista
server.get('/alunos',(req,resp,next)=>{
    Aluno.find().then(alunos=>{
    resp.json(alunos)
    return next()
   })
})

//where
server.get('/alunos/:id',(req,resp,next)=>{
    Aluno.findById(req.params.id).then(aluno=>{
        if(aluno){
            resp.json(aluno)
        }else{
            resp.status(404)
            resp.json({message:'Não há este aluno'})
        }
        return next()
    })
})       

///Inserir
server.post('/alunos',(req,resp,next)=>{
    let aluno = new Aluno(req.body)
    aluno.save().then(aluno=>{
        Response.json(aluno)
    }).catch(error=>{
        resp.status(400)
        resp.json({message:error.message})
    })
})

//Update
server.put('/alunos/:id', async (req,resp,next)=>{
    if(!req.is('application/json')){
      return next(new errors.InvalidContentError("Dados Invalidos na requisição"))
    }
    try{
        const aluno = await Aluno.findOneAndUpdate({_id:req.params.id},req.body)
        resp.send(200)
        next()
    }catch(error){
        return next(new errors.ResourceNotFound("Item não encontrado"))
    }
}
)

//Delete
server.del('/alunos/:id', async (req,resp,next)=>{
    try{
        const aluno = await Aluno.findOneAndRemove({_id:req.params.id},req.body)
        resp.send(204)
        next()
    }catch(error){
        return next(new errors.ResourceNotFound("Item não encontrado"))
    }
}
)

}).catch(console.error)

