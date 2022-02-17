import { ChangeEvent, useEffect, useState } from "react";


import { ProdutoInterface } from "../../interfaces/ProdutoInterface";
import axios from "axios";
import Produto from "../../components/Produto";
import Button from "../../components/Button";
import PageCadastrar from "../pageCadastrar/PageCadastrar";

function PageProdutos() {

  const [listaProdutos, setlistaProdutos] = useState<ProdutoInterface[]>([]);
  const [produto, setproduto] = useState<ProdutoInterface>();

  const [isTelaCadastro, setisTelaCadastro] = useState(false);
  const [modoEdit, setmodoEdit] = useState(false);

  const [mensagem, setmensagem] = useState('');
  const [filtro, setfiltro] = useState('');

  const [paginaAtual, setpaginaAtual] = useState(0);
  
  
  const itemsPorPagina = 5
  const paginas = Math.ceil(listaProdutos.length / itemsPorPagina)
  const indiceInicial = paginaAtual * itemsPorPagina
  const indiceFinal = indiceInicial + itemsPorPagina
  

  useEffect(() => {
    axios.post("http://testefrontend.linearsm.com.br/api/Produtos/Selecionar/")
      .then(lista => {
       
        setlistaProdutos(lista.data.listaProdutos.sort((a:ProdutoInterface,b : ProdutoInterface)=>{
          if(a.descricao < b.descricao){
            return -1
          }else{
            return 1
          }
        }))
      }).catch(erro => {
        console.log("Ocorreu um erro");
      })
  }, [isTelaCadastro, mensagem])

  const excluirProduto = (id: number) => {
    axios.post("http://testefrontend.linearsm.com.br/api/Produtos/Excluir", {
      idProduto: id
    }).then(retorno => {

      setmensagem(retorno.data.message)
      const novaLista: ProdutoInterface[] = listaProdutos?.filter(produto => produto.idProduto !== id)
      setlistaProdutos(novaLista)
      console.log(retorno.data.message);
    }).catch(erro => {
      console.log(erro);
    })
  }

  const editarProduto = (id: number) => {
      setproduto(listaProdutos.find(produto => produto.idProduto === id))
      setisTelaCadastro(true)
      setmodoEdit(true)
  }

  const renderizarProdutos = listaProdutos?.slice(indiceInicial, indiceFinal).map((produto, index) => {
    return (
      produto.descricao.toLowerCase().includes(filtro.toLowerCase()) || produto.codigo.toLowerCase().includes(filtro.toLowerCase()) ?
        <Produto key={index} func={excluirProduto} funcEdit={editarProduto} produto={produto} />
        : null
    )
  })

  const renderizaMensagem = setTimeout(() => {
    setmensagem("")
  }, 4000);


  const ordenarLista = (event : ChangeEvent<HTMLSelectElement>)=>{
    const ordenarPor = event.target.value
    let newLista = []
    switch(ordenarPor){

      case "descricao":

        newLista = listaProdutos.sort((a, b)=>{
          if(a.descricao < b.descricao){
            
            return -1
          }else{
            return 1
          }
        })

        setlistaProdutos([...newLista])
      break;
      case "codigo":

        setlistaProdutos([...listaProdutos.sort((a, b)=>{
        if(a.codigo < b.codigo){
          return -1
        }else{
          return 1
        }
      })])
      break;

      case "estoque":

        setlistaProdutos([...listaProdutos.sort((a, b)=>{
        if(a.emEstoque < b.emEstoque){
          return -1
        }else{
          return 1
        }
      })])
      break;

    }
    console.log(listaProdutos);
    
  }

  const salvarProduto = (produto : ProdutoInterface)=>{
    
    axios.post("http://testefrontend.linearsm.com.br/api/Produtos/CadastrarAtualizar",produto).then(retorno=>{
            console.log(retorno);
            setisTelaCadastro(false)
            setmodoEdit(false)
            setmensagem(retorno.data.message)  
          }).catch(erro=>{
            console.log(erro)
          })
          
  }

 const renderizarProdutosEmEstoque = listaProdutos.map(produto=>{
   if(produto.emEstoque){

     return (
       <li key={produto.codigo} className="list-group-item list-group-item-light">
          <span className="flex justify-between font-bold text-2xl">

          Código: {produto.codigo}
          <span>
          {produto.descricao}
          </span>
          </span>
          
        </li>
      )
    }else{
      return null
    }
 })

  return (
    <div className={`flex flex-col  w-auto h-full mt-7 items-center select-none`}>
      <div className="flex justify-start flex-col md:flex-row  md:items-center w-3/4">



        {isTelaCadastro ? null : (<>
          <Button nome={`Cadastrar`} cor={`bg-blue-500`}
            func={() => setisTelaCadastro(true)} />
          <button className={`md:ml-2 ml-0 bg-orange-500 p-3 rounded-lg
                             text-white
                            transition ease-in-out delay-100 hover:scale-110`} 
                            type="button" data-bs-toggle="modal" data-bs-target="#modalEstoque">
            Estoque
          </button>

          <div className="modal fade " id="modalEstoque" tabIndex={-1} aria-labelledby="ModalLabel" aria-hidden="true">
              <div className="modal-dialog ">
                <div className="modal-content rounded">
                  <div className="modal-header ">
                    <h5 className="modal-title" id="ModalLabel">Produtos em Estoque</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body bg-primary">
                      <ul className="list-group">
                          {renderizarProdutosEmEstoque || 'Não Existem produtos em estoque'}
                      </ul>
                  </div>
                </div> 

              </div>
          </div>
        </>)}

        {renderizaMensagem && (
          <div className={`toast show w-3/4 fixed bottom-0 right-0 p-3 bg-warning z-10 ${mensagem==='' && 'hidden'}`} 
                      role={"alert"}  aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Mensagem</strong>
          
            </div>
            <div className="toast-body text-2xl text-center">
                  {mensagem}
              </div>
          </div>
        )}

        {!isTelaCadastro ? (
          <div className="w-full relative flex justify-end flex-col items-center">
            
            <input className={`text-center md:ml-auto h-20 md:h-full bg-gray-200 p-2 md:w-3/4
                              focus:outline-none rounded-xl`} placeholder="Pesquisar por Código/Descrição"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setfiltro(event.target.value)
              }} ></input>
            <select className="form-select self-end w-25 mt-1 h-50" onChange={ordenarLista}>

              <option value={"descricao"}>Descrição</option>
              <option value={"codigo"}>Código</option>
              <option value={"estoque"}>Estoque</option>
            </select>

          </div>

        )
          : null}
      </div>

      {isTelaCadastro ? <PageCadastrar funcSave={salvarProduto} setTela={() => {
        setmodoEdit(false)
        setisTelaCadastro(false)
      }} modoEdit={modoEdit} produto={produto}/> : renderizarProdutos
      

      }
      {!isTelaCadastro? 
      <div>
      <ul className="pagination">
        {Array.from(Array(paginas), (item, index)=> {
          return <li className="page-item"><button className="page-link" onClick={()=>setpaginaAtual(index)}>{index+1}</button></li>
        })}
      
      </ul>  
      </div>
      : null}
    </div>
  );
}

export default PageProdutos;