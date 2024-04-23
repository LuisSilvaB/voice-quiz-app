import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../config/config";
import { Course } from "../../class/course.class";
import { ModalActions } from "../../interface/types";

export const createCourse = createAsyncThunk(
    'user/createCourse',
    async (course: Course) => {
        try {
            const { data } = await supabase.from('COURSES').insert([course]).select('*'); 
            return data && data[0] as Course; 
        } catch (error) {
            console.error("Error al crear el curso: ", error);
        }
    }
);

export const updateCourse = createAsyncThunk(
  'user/updateCourse', 
  async (course: Course) => {
    try {
      const { error, data } = await supabase
        .from("COURSES")
        .update(course)
        .eq('user_id', course.user_id)
        .eq("ID", course.ID)
        .select('*');

        console.log(error)
      return data as Course[];
    } catch (error) {
      console.error("Error al actualizar el curso: ", error);
      console.error("Error al actualizar el curso: ", error);
    }
  }
)

export const deleteCourse = createAsyncThunk(
  'user/deleteCourse', 
  async (course: Course) => {
    try {
       await supabase
        .from("COURSES")
        .delete()
        .eq('user_id', course.user_id)
        .eq("ID", course.ID)
        const { data } = await supabase
          .from("COURSES")
          .select("*")
          .eq("user_id", course.user_id);
        return data as Course[];
    } catch (error) {
      console.error("Error al actualizar el curso: ", error);
    }
  }
)

export const getAllCourses = createAsyncThunk(
  "user/getAllCourses",
  async (userId: string) => {
    if (userId) {
      try {
        const { data } = await supabase.from("COURSES").select("*").eq('user_id', userId);
        return data as Course[];
      } catch (error) {
        console.error("Error al obtener los cursos: ", error);
      }
    }
  },
);



const coursesSlice = createSlice({
    name: "course_slice",
    initialState: {
        course: {} as Course,
        courses: [] as Course[],
        targetCourse: {} as Course,
        courseLoading: false as boolean,
        coursesLoading: false as boolean,
        targetCourseLoading: false as boolean,
        // Modal actions
        isOpenModal: false as boolean,
        typeModal: null as ModalActions, 
    },
    reducers: {
        setLoadingCourseDB: (state, action) => {
            state.courseLoading = action.payload;
        },
        setLoadingCoursesDB: (state, action) => {
            state.coursesLoading = action.payload;
        },
        clearCourseData: (state) => {
            state.course = {} as Course;
            state.courseLoading = false;
        },
        setTargetCourse: (state, action) => {
            state.targetCourse = action.payload;
            state.targetCourseLoading = false;
        }, 
        clearTargetCourse: (state) => {
            state.targetCourse = {} as Course;
            state.targetCourseLoading = false;
        }, 
        setTypeModal: (state, action) => {
            state.typeModal = action.payload;
        },
        setToggleModal: (state) => {
            state.isOpenModal = !state.isOpenModal;
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(createCourse.pending, (state) => {
            state.courseLoading = true;
          })
          .addCase(createCourse.fulfilled, (state, action) => {
            state.courseLoading = false;
            state.course = action.payload ?? ({} as Course);
          })
          .addCase(createCourse.rejected, (state) => {
            state.courseLoading = false;
          })
          .addCase(getAllCourses.pending, (state) => {
            state.coursesLoading = true;
          })
          .addCase(getAllCourses.fulfilled, (state, action) => {
            state.coursesLoading = false;
            state.courses = action.payload as Course[];  
          })
          .addCase(getAllCourses.rejected, (state) => {
            state.coursesLoading = false;
          })
          .addCase(deleteCourse.pending, (state) => {
            state.coursesLoading = true;
          })
          .addCase(deleteCourse.fulfilled, (state, action) => {
            state.coursesLoading = false;
            state.courses = action.payload as Course[];
          })
    },
});

// Exportar acciones y reducer del slice
export const {
  setLoadingCourseDB,
  setLoadingCoursesDB,
  clearCourseData,
  setTypeModal,
  setToggleModal,
  setTargetCourse,
  clearTargetCourse,
} = coursesSlice.actions;
export default coursesSlice.reducer;