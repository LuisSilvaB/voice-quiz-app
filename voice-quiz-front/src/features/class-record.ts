import { createSlice } from "@reduxjs/toolkit"; 
import CourseClass from "../class/course.class";
import { ModalActions } from "../interface/types";

const ClassRecordSlice = createSlice({
    name: "Course",
    initialState: {
        classRecords: [] as CourseClass[],
        classRecordTarget: {} as CourseClass,
        isOpenModal: false, 
        typeModal: null as ModalActions
    },
    reducers:{
        setTargetCourse: (state, action) => {
            state.classRecordTarget = action.payload as CourseClass; 
        }, 
        clearTargetCourse: (state) => {
            state.classRecordTarget = {} as CourseClass
        }, 
        setCourses: (state, action) => {
            state.classRecords = action.payload as CourseClass[]; 
        },
        clearCourses:(state) => {
            state.classRecords = [] as CourseClass[]
        }, 
        setIsOpenModal:(state, action) => {
            state.isOpenModal = action.payload; 
        },
        setTypeModal:(state, action) => {
            state.typeModal = action.payload;
        }
    }
})

export const { setTargetCourse, clearTargetCourse, clearCourses, setCourses, setIsOpenModal, setTypeModal } = ClassRecordSlice.actions; 
export default ClassRecordSlice.reducer; 