import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import Select from 'react-select'
import { ProdutoInterface } from "../../interfaces/ProdutoInterface";
import CurrencyInput from 'react-currency-input-field'
import Button from "../../components/Button";
import { Cor, CorInterface } from "../../interfaces/CorInterface";
import axios from "axios";

interface PageCadastrarProps {
     funcSave : (produt : ProdutoInterface)=>void
     setTela : ()=>void
     modoEdit? : boolean | false
     produto? : ProdutoInterface
}

function PageCadastrar(props : PageCadastrarProps) {

    const [codigo, setCodigo] = useState<string>(props.produto?.codigo || '');
    const [descricao, setDescricao] = useState<string>(props.produto?.descricao ||"");
    const [cores, setCores] = useState<Cor[]>([]);
    const [coresInProduto, setCoresInProduto] = useState<CorInterface[]>(props.produto?.cor || []);
    const [valor, setValor] = useState<number>(props.produto?.valor ||0);
    const [emEstoque, setEmEstoque] = useState<boolean>(props.produto?.emEstoque || false);
    
    
    useEffect(() => {
      axios.post("http://testefrontend.linearsm.com.br/api/Cores/Selecionar")
      .then(retorno=>{
        setCores(retorno.data.lista)
      }).catch(erro=>{
          console.log(erro);
      })
    }, [])
    

    const salvarProduto = (event : FormEvent<HTMLFormElement>)=>{
        event.preventDefault()

        if(coresInProduto.length < 1){
            return
        }
        let produto : ProdutoInterface
        if(!props.modoEdit){

            produto = {
                codigo : codigo,
                descricao : descricao,
                emEstoque : emEstoque,
                valor : valor,
                cor : coresInProduto
            }
        }else{
            produto = {
                idProduto : props.produto?.idProduto,
                codigo : codigo,
                descricao : descricao,
                emEstoque : emEstoque,
                valor : valor,
                cor : coresInProduto
            }
            props.funcSave(produto)
        }
    }

    const codigoHandler= (evt : ChangeEvent<HTMLInputElement>)=>{
        setCodigo(evt.target.value)
    }

    const descricaoHandler = (evt : ChangeEvent<HTMLInputElement>)=>{
        setDescricao(evt.target.value)
    }

    const valueHandler = (valor:any)=>{
        setValor(valor)
    }

    const coresHandler = (evt : any)=>{
        
        const listaCores : CorInterface[] = evt.map((cor:any)=>{
            return {
                idCor : +cor.value,
                nome : cor.label
            }
        })
        setCoresInProduto([...listaCores])
       
    }
    
    const renderizarOpCores = cores?.map(cor=>{
        return {
            value : cor.id,
            label : cor.codigo
        }
    })

    return (  
        
        <Container className="mt-3" >
        {!props.modoEdit? (

            <Form onSubmit={salvarProduto}>
            <div className="p-4 text-center w-full text-5xl tracking-widest font-sans font-bold">Cadastro de Produto</div>
            <Form.Group className="mb-3">
            <Form.Label htmlFor="codigo">C??digo</Form.Label>
            <input type="text"  className="form-control" value={codigo} onChange={codigoHandler} name="codigo" id="codigo" maxLength={20} required/>
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label htmlFor="descricao">Descri????o</Form.Label>
            <input type="text" className="form-control" id="descricao" value={descricao} onChange={descricaoHandler} name="descricao" maxLength={50}/>
            </Form.Group>
            <Form.Group>
            <Form.Label htmlFor="valor">Valor</Form.Label>
            <CurrencyInput className="form-control" prefix="R$ " decimalSeparator="," decimalsLimit={2} required placeholder="R$ X.XXX,XX"
                        decimalScale={2} value={valor} onValueChange={valueHandler}   maxLength={6}/>
            </Form.Group>
            <div className="form-check mt-3">
                <input className="form-check-input" id="estoque" type="checkbox" checked={emEstoque} onChange={e=>setEmEstoque(!emEstoque)}/>
                <label htmlFor="estoque">Tem Estoque</label>
            </div>
            <label htmlFor="cores" className="form-label mt-3">Cores</label>
            <Select id="cores" onChange={(e)=>coresHandler(e)} isMulti closeMenuOnSelect={false} options={renderizarOpCores} 
                    classNamePrefix="Cores..."/>
            {coresInProduto.length < 1? (
                <div className="alert alert-warning" role={"alert"}>
                    ?? necess??rio selecionar pelo menos uma cor
                </div>
            ): null}
            <div className="w-full flex mt-4 flex-col justify-center md:flex-row md:justify-end">
            <Button nome="Salvar" cor="bg-green-700" func={()=>salvarProduto}/>    
            <Button nome="Cancelar" cor="bg-red-500" className="  md:ml-3" func={props.setTela}/>
            </div>
            </Form>)
        :       
                
        (

            <Form onSubmit={salvarProduto}>
            <div className="p-4 text-center w-full text-5xl tracking-widest font-sans font-bold">Edi????o do Produto</div>
            <Form.Group className="mb-3">
            <Form.Label htmlFor="codigo">C??digo</Form.Label>
            <input type="text"  className="form-control" value={codigo} onChange={codigoHandler} name="codigo" id="codigo" maxLength={20} required/>
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label htmlFor="descricao">Descri????o</Form.Label>
            <input type="text" className="form-control" id="descricao" value={descricao} onChange={descricaoHandler} name="descricao" maxLength={50}/>
            </Form.Group>
            <Form.Group>
            <Form.Label htmlFor="valor">Valor</Form.Label>
            <CurrencyInput className="form-control" prefix="R$ " decimalSeparator="," decimalsLimit={2} required placeholder="R$ X.XXX,XX"
                        decimalScale={2} value={valor} onValueChange={valueHandler}   maxLength={6}/>
            </Form.Group>
            <div className="form-check mt-3">
                <input className="form-check-input" id="estoque" type="checkbox"  checked={emEstoque} onChange={e=>setEmEstoque(!emEstoque)}/>
                <label htmlFor="estoque">Tem Estoque</label>
            </div>
            <label htmlFor="cores" className="form-label mt-3">Cores</label>
            <Select id="cores" onChange={(e)=>coresHandler(e)} isMulti closeMenuOnSelect={false} value={coresInProduto.map(cor=>{
                return {
                    value : cor.idCor,
                    label : cor.nome
                }
            })} options={renderizarOpCores} 
                    classNamePrefix="Cores..."/>
            {coresInProduto.length < 1? (
                <div className="alert alert-warning" role={"alert"}>
                    ?? necess??rio selecionar pelo menos uma cor
                </div>
            ): null}
            <div className="w-full flex mt-4 flex-col justify-center md:flex-row md:justify-end">
            <Button nome="Atualizar" cor="bg-green-700" func={()=>salvarProduto}/>    
            <Button nome="Cancelar" cor="bg-red-500" className="  md:ml-3" func={props.setTela}/>
            </div>
            </Form>)   }
            </Container>
            )   
        
    
}

export default PageCadastrar;