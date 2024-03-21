import useTypewriter from "../../../hooks/useTypeWriter";

interface Props {
    text:string; 
    speed:number;
}
const TypeWriter:React.FC<Props> = ({text, speed}) => {
    const displayText = useTypewriter(text, speed);
  
    return <span className="h-full">{displayText}</span>;
  };
  
  export default TypeWriter;