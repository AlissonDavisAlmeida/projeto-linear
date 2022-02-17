    import { VscGraph } from "react-icons/vsc"
   

function Header() {
    return (  
        <div className={`w-full h-16 bg-gradient-to-r from-blue-400  to-blue-500 flex items-center p-4`}>
            <span className="text-2xl flex items-center tracking-widest text-white font-bold font-sans hover:text-gray-500
                            ">LinearSm <VscGraph  className="ml-3"/></span>
        </div>
    );
}

export default Header;