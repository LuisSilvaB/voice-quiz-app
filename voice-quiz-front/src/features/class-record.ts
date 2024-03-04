import { createSlice } from "@reduxjs/toolkit"; 
import ClassRecord from "../class/class-record.class";
import { ModalActions } from "../interface/types";

const ClassRecordSlice = createSlice({
    name: "classRecord",
    initialState: {
        classRecords: [] as ClassRecord[],
        classRecordTarget: {} as ClassRecord,
        isOpenModal: false, 
        typeModal: null as ModalActions
    },
    reducers:{
        setTargetClassRecord: (state, action) => {
            state.classRecordTarget = action.payload; 
        }, 
        clearTargetClassRecord: (state) => {
            state.classRecordTarget = {} as ClassRecord
        }, 
        setClassRecords: (state, action) => {
            state.classRecords = action.payload; 
        },
        clearClassRecords:(state) => {
            state.classRecords = [] as ClassRecord[]
        }, 
        setIsOpenModal:(state, action) => {
            state.isOpenModal = action.payload; 
        },
        setTypeModal:(state, action) => {
            state.typeModal = action.payload;
        }
    }
})

export const { setTargetClassRecord, clearTargetClassRecord, clearClassRecords, setClassRecords, setIsOpenModal, setTypeModal } = ClassRecordSlice.actions; 
export default ClassRecordSlice.reducer; 