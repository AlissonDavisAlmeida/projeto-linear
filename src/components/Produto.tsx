import { ProdutoInterface } from "../interfaces/ProdutoInterface";
import Button from "./Button";


interface ProdutoProps{
    produto : ProdutoInterface,
    func : (id : number)=>void
    funcEdit : (id: number)=>void
}

function Produto(props : ProdutoProps) {

    const produtos = props.produto

    const excluirProduto =()=>{
        props.func(produtos.idProduto || 0)
    }

    const editarProduto = ()=>{
        props.funcEdit(produtos.idProduto || 0)
    }
  

    return (  
        <div className={`w-3/4 bg-gradient-to-r from-gray-100 to-gray-400 shadow-xl hover:scale-105 transition-all cursor-pointer
                 shadow-blue-500 font-bold flex flex-col md:flex-row justify-between items-center 
                   text-2xl rounded-xl px-4 py-2 m-3 `}>
            
            <span className="hidden lg:inline">Código: {produtos.codigo}</span>
            <span className="">{produtos.descricao}</span>
            <span className="">R${produtos.valor}</span>
            <span className="hidden md:inline">{produtos.emEstoque? 'Estoque' : 'Zerado'}</span>
            <div className="flex flex-col md:flex-row">
                <Button nome="Editar" className="mr-0 w-56 md:mr-2 md:w-full" cor="bg-purple-500" func={editarProduto}/>
                <Button cor="bg-red-500 " func={excluirProduto}  nome={`Excluir`}/>
            </div>
        </div>
    );
}

export default Produto;