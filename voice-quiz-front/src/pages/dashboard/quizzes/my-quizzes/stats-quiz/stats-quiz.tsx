import { Button, IconButton, Typography } from "@material-tailwind/react";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { getParticipantsByQuizID, getQuizByID } from "../../../../../features/db-features/quizzes.features";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../app/store";
import { Quiz } from "../../../../../class/quiz.class";
import { useEffect, useState } from "react";
import { Result } from "../../../../../class/questions.class";
import { getResultsByQuizId } from "../../../../../features/db-features/results.features";
import StatsTable from "./stats-table";

export type Participant = {
  ID: string;
  img_url: string;
  name:string;
};

export type Stats = {
  averageScore: number;
  participants: number;
  passed: number;
  totalAverageScore: number;
};
export interface UserTable {
  userName: string;
  finalScore: number;
  passed: boolean;
}

const StastQuiz = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const [ currentQuiz, setCurrentQuiz ] = useState<Quiz | null>(null)
  const [ listParticipants, setListParticipants ] = useState<Participant[] | null>(null)
  const [ listResults, setListResults ] = useState<Result[] | null>(null)
  const [ stats, setStats ] = useState<Stats | null>(null)
  // const [ userResults, setUserResults ] = useState<UserTable[] | null>(null)

  const userResults: UserTable[] = [];

  const onReturnToMyQuizzes = () => {
    navigate(`/dashboard/my-quizzes`)
  }

  function calculateStats(results: Result[]) {
    const userScores: { [key: string]: number } = {};
    let totalScore = 0;
    let passedCount = 0;
    let totalAverageScore = 0;

    results.forEach(result => {
        const userID = result.USER_ID;
        const score = result.SCORE;
        totalScore += score;

        if (!userScores[userID]) {
            userScores[userID] = 0;
        }
        userScores[userID] += score;
    });

    const participants = Object.keys(userScores).length;

    Object.values(userScores).forEach(totalUserScore => {
        if (totalUserScore >= 10.5) {
            passedCount++;
        }
    });

    const averageScore = totalScore / results.length;
    totalAverageScore = totalScore / participants;

    return {
        averageScore,
        totalAverageScore,
        participants,
        passed: passedCount
    };
}

const calculeUserScore = () => {
  const userScores: { [key: string]: UserTable } = {};

  listResults?.forEach(result => {
    const userID:string = result.USER_ID;
    const score:number = result.SCORE;

    if (!userScores[userID]) {
      userScores[userID] = {
        userName: listParticipants?.find(participant => participant.ID === userID)?.name ?? "",
        finalScore: 0,
        passed: false
      };
    }

    userScores[userID].finalScore += score;
  });

  const currentUsers = Object.values(userScores).map(userScore => {
    userScore.passed = userScore.finalScore >= 10.5;
    return userScore;
  });
  userResults.push(...currentUsers);
}


  useEffect(()=>{
    const fn = async() => {
      const quiz = await dispatch(getQuizByID(params.quizId as string));
      const listParticipants = await dispatch(getParticipantsByQuizID(params.quizId as string));
      const listResults = await dispatch(getResultsByQuizId(params.quizId as string));
      setCurrentQuiz(quiz.payload as Quiz)
      setListParticipants(listParticipants.payload as Participant[])
      setListResults(listResults.payload as Result[])
      if(listResults.payload) {
        const statsCaalculated = calculateStats(listResults.payload as Result[])
        setStats(statsCaalculated);
      }
    }
    if (params.quizId) {
      fn()
    }
    // eslint-disable-next-line
  },[])

  useEffect(()=>{
    if(listResults?.length && listParticipants?.length){
      calculeUserScore()
    }
  },[listResults, listParticipants])

  return (
    <div className="max-h m-4 flex w-full flex-1 flex-col rounded-lg border p-2">
      <div className="flex w-full flex-row items-center justify-between gap-2 text-center">
        <div className="flex w-fit flex-row items-center justify-center gap-2">
          <IconButton
            placeholder={""}
            onClick={onReturnToMyQuizzes}
            variant="gradient"
            size="md"
            color="teal"
          >
            <FaCircleArrowLeft className="h-auto w-4 text-white" />
          </IconButton>
          <h3 className="text-center text-xl font-bold text-blue-gray-600 lg:text-2xl">
            Estadísticas del quiz
          </h3>
        </div>
        <Button
          placeholder={""}
          size="sm"
          color="blue"
          variant="outlined"
          className="border"
          // onClick={onEditQuiz}
        >
          <Typography
            placeholder={""}
            variant="small"
            className="text-xs font-bold text-current"
          >
            Quiz: {currentQuiz?.title}
          </Typography>
        </Button>
      </div>
      <div className="mt-6 flex w-full flex-row flex-wrap justify-between gap-2">
        <div className="flex h-[150px] w-[23%] min-w-[230px] flex-col rounded-lg border bg-gray-900 p-3 shadow-md">
          <Typography
            placeholder={""}
            variant="h4"
            className="text-start font-bold text-white"
          >
            Score Promedio
          </Typography>
          <div className="flex h-full w-full flex-row items-center justify-center">
            <Typography
              placeholder={""}
              variant="h2"
              className="text-start  font-normal text-white"
            >
              {stats?.averageScore.toFixed(2) ?? 0}
            </Typography>
          </div>
        </div>
        <div className="flex h-[150px] w-[23%] min-w-[230px] flex-col rounded-lg border bg-gray-900 p-3 shadow-md">
          <Typography
            placeholder={""}
            variant="h4"
            className="text-start font-bold text-white"
          >
            Participantes
          </Typography>
          <div className="flex h-full w-full flex-row items-center justify-center">
            <Typography
              placeholder={""}
              variant="h2"
              className="text-start  font-normal text-white"
            >
              {stats?.participants ?? 0}
            </Typography>
          </div>
        </div>
        <div className="flex h-[150px] w-[23%] min-w-[230px] flex-col rounded-lg border bg-gray-900 p-3 shadow-md">
          <Typography
            placeholder={""}
            variant="h4"
            className="text-start font-bold text-white"
          >
            Aprobados
          </Typography>
          <div className="flex h-full w-full flex-row items-center justify-center">
            <Typography
              placeholder={""}
              variant="h2"
              className="text-start  font-normal text-white"
            >
              {stats?.passed ?? 0}
            </Typography>
          </div>
        </div>
        <div className="flex h-[150px] w-[23%] min-w-[230px] flex-col rounded-lg border bg-gray-900 p-3 shadow-md">
          <Typography
            placeholder={""}
            variant="h4"
            className="text-start font-bold text-white"
          >
            Calificación promedio
          </Typography>
          <div className="flex h-full w-full flex-row items-center justify-center">
            <Typography
              placeholder={""}
              variant="h2"
              className="text-start  font-normal text-white"
            >
              {stats?.totalAverageScore.toFixed(0) ?? 0}
            </Typography>
          </div>
        </div>
      </div>
      <div className="mt-2 w-full p-2 shadow-lg flex flex-col rounded-lg h-full">
        <div className="mt-5 w-full ">
          <p className="text-3xl font-bold text-gray-900">
            Score de estudiantes
          </p>
        </div>
        <div className="w-full h-full">
          <StatsTable userResults={userResults} />
        </div>
      </div>
    </div>
  );
}

export default StastQuiz