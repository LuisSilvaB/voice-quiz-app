import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch } from "../../../../app/store";
import { getQuizByID } from "../../../../features/db-features/quizzes.features";

const Quiz = () => {
  const quizId = useParams().quizId as string;
  const dispatch =useDispatch<AppDispatch>()
  useEffect(()=>{
    const fn = async() => {
      const quizData = await dispatch(getQuizByID(quizId))
      console.log(quizData)
    } 
    fn()
  },[])
  return (
    <div className="flex h-full w-full flex-1 justify-center rounded-lg p-4">
      <div>BIENVENIDO A LOS JUEGOS DEL HAMBRE</div>
    </div>
  );
}

export default Quiz