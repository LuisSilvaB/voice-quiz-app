import { motion } from "framer-motion" 
import { useSelector, useDispatch } from "react-redux"
import { setToggleModal, clearTargetCourse } from "../../../../../../features/db-features/courses.features";
import { IoMdClose } from "react-icons/io";
import { variants } from '../../../types';
import { RootState } from '../../../../../../app/store';
import { FiPlus } from "react-icons/fi";
import CreateCourseForm from "./create-course.form";



const CreateCourseModal:React.FC = () => {
  const dispatch = useDispatch(); 
  const isOpenModal = useSelector((state:RootState) => state.courses.isOpenModal )
  const typeModal = useSelector((state:RootState) => state.courses.typeModal )
  // const targetCourse = useSelector((state:RootState) => state.course.classRecordTarget)


  const closeModal = () => {
    dispatch(setToggleModal())
    dispatch(clearTargetCourse()); 
  }




  return (
    <motion.div
      variants={variants}
      initial="exit"
      animate={isOpenModal && typeModal === "create" ? "enter" : "exit"}
      className="fixed left-0  top-0 z-30 h-full w-full bg-[#0000004d] select-none"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-auto w-[450px] rounded-lg bg-white">
          <div className="flex w-full flex-col justify-between px-2 py-2">
            <div
              onClick={closeModal}
              className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-2xl transition-all hover:text-red-600 focus:text-red-600"
            >
              <IoMdClose />
            </div>
            <div className="absolute -top-10 left-0 right-0 mx-auto flex h-20 w-20 items-center justify-center rounded-full border bg-white text-4xl text-green-600 ">
              <FiPlus />
            </div>
            
            {/* <div
              style={{
                backgroundImage: `url(${targetCourse?.placeholderImg})`,
              }}
              className="h-40 w-full rounded-lg"
            /> */}

            <div className="mt-10 flex w-full flex-col items-center justify-center gap-1">
              <p className="font-inter text-lg font-bold">Crear curso</p>
              <p className="text-md w-full text-center font-inter font-normal text-gray-600">
                Sientete libre de crear tu curso 
              </p>
              <p className="text-md w-full text-center font-inter font-bold text-gray-600">
                Datos
              </p>
            </div>

            {/** Form */}
            
            <CreateCourseForm onClose={closeModal}/>

          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CreateCourseModal