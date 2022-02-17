import { CorInterface } from "./CorInterface";

export interface ProdutoInterface {
    idProduto? : number
    codigo : string
    descricao : string
    cor : CorInterface[]
    valor : number
    emEstoque : boolean
}