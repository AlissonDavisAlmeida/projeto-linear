


interface ButtonProps{
    nome : string
    cor : string
    type? : string
    func : ()=>void
  
    className? : string
}

function Button(props : ButtonProps) {

    

    return (
        <div className={` ${props.className || ''} `}>
            <button className={`${props.cor} p-3 rounded-lg w-full text-white
                   transition ease-in-out delay-100 hover:scale-110`} 
                   onClick={props.func}>{props.nome}</button>
        </div>
      );
}

export default Button;