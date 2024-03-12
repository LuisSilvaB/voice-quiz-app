import { createSlice } from "@reduxjs/toolkit"; 
import CourseClass from "../class/course.class";
import { ModalActions } from "../interface/types";

const CourseSlice = createSlice({
    name: "Course",
    initialState: {
        Courses: [] as CourseClass[],
        CourseTarget: {} as CourseClass,
        isOpenModal: false, 
        typeModal: null as ModalActions
    },
    reducers:{
        setTargetCourse: (state, action) => {
            state.CourseTarget = action.payload as CourseClass; 
        }, 
        clearTargetCourse: (state) => {
            state.CourseTarget = {} as CourseClass
        }, 
        setCourses: (state, action) => {
            state.Courses = action.payload as CourseClass[]; 
        },
        clearCourses:(state) => {
            state.Courses = [] as CourseClass[]
        }, 
        setIsOpenModal:(state, action) => {
            state.isOpenModal = action.payload; 
        },
        setTypeModal:(state, action) => {
            state.typeModal = action.payload;
        }
    }
})

export const { setTargetCourse, clearTargetCourse, clearCourses, setCourses, setIsOpenModal, setTypeModal } = CourseSlice.actions; 
export default CourseSlice.reducer; 