import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../config/config";
import { Session } from "../../class/sessions";
import { ModalActions } from "../../interface/types";
import { toast } from "sonner";

export const createSession = createAsyncThunk(
    'session/createSession',
    async (session: Session) => {
        try {
            await supabase.from('SESSIONS').insert([session]).select('*'); 
            const { data } = await supabase
            .from("SESSIONS")
            .select("*")
            .eq("USER_ID", session.USER_ID).eq('COURSE_ID', session.COURSE_ID);
          return data as Session[];
        } catch (error) {
            console.error("Error al crear la sesssion: ", session);
        }
    }
);

export const updateSession = createAsyncThunk(
  'session/updateSession', 
  async (session: Session) => {
    try {
      const { data } = await supabase
        .from("SESSIONS")
        .update(session)
        .eq('USER_ID', session.USER_ID)
        .eq("ID", session.ID)
        .select('*');
        

      return data as Session[];
    } catch (error) {
      toast.error("Error al actualizar la session");
    }
  }
)


export const deleteSession = createAsyncThunk(
  'session/deleteSession', 
  async (session: Session) => {
    try {
       await supabase
        .from("SESSIONS")
        .delete()
        .eq("USER_ID", session.USER_ID)
        .eq("ID", session.ID)
        const { data } = await supabase
          .from("SESSIONS")
          .select("*")
          .eq("USER_ID", session.USER_ID)
          .eq("COURSE_ID", session.COURSE_ID)
        return data as Session[];
    } catch (error) {
      console.error("Error al actualizar la session: ", error);
    }
  }
)

export const getSession = createAsyncThunk(
  "session/getSession",
  async ({
    sessionId,
    userId
  }: {
    sessionId: string;
    userId: string;
  }) => {
    try {
      const { data } = await supabase
        .from("SESSIONS")
        .select("*")
        .eq("ID", sessionId)
        .eq("USER_ID", userId);
      return data?.[0] ?? ({} as Session);
    } catch (error) {
      toast.error("Error al obtener las session");
    }
  },
);

export const getAllSessions = createAsyncThunk(
  "user/getAllSessions",
  async ({userId, courseId} : { userId:string, courseId:string }) => {
    if (userId && courseId) {
      try {
        const { data } = await supabase.from("SESSIONS").select("*").eq('USER_ID', userId).eq('COURSE_ID', courseId);
        return data as Session[] ;
      } catch (error) {
        console.error("Error al obtener los cursos: ", error);
      }
    }
  },
);



const sessionsSlice = createSlice({
    name: "sessions_slice",
    initialState: {
        session: {} as Session,
        sessions: [] as Session[],
        targetSession: {} as Session,
        sessionLoading: false as boolean,
        sessionsLoading: false as boolean,
        targetSessionLoading: false as boolean,
        // Modal actions
        sessionIsOpenModal: false as boolean,
        sessionTypeModal: null as ModalActions, 
        context: 500 as number, 
    },
    reducers: {
        setLoadingSessionDB: (state, action) => {
            state.sessionLoading = action.payload;
        },
        setLoadingSessionsDB: (state, action) => {
            state.sessionsLoading = action.payload;
        },
        clearSessionsData: (state) => {
          state.sessions = [] as Session[];
          state.sessionLoading = false;
      },
        clearSessionData: (state) => {
            state.session = {} as Session;
            state.sessionLoading = false;
        },
        setTargetSession: (state, action) => {
            state.targetSession = action.payload;
            state.targetSessionLoading = false;
        }, 
        clearTargetSession: (state) => {
            state.targetSession = {} as Session;
            state.targetSessionLoading = false;
        }, 
        setSessionTypeModal: (state, action) => {
            state.sessionTypeModal = action.payload;
        },
        setSessionToggleModal: (state) => {
            state.sessionIsOpenModal = !state.sessionIsOpenModal;
        }, 
        setContext: (state, action) => {
            state.context = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(createSession.pending, (state) => {
            state.sessionsLoading = true;
          })
          .addCase(createSession.fulfilled, (state, action) => {
            state.sessionsLoading = false;
            state.sessions = action.payload ?? ([] as Session[]);
          })
          .addCase(createSession.rejected, (state) => {
            state.sessionLoading = false;
          })
          .addCase(getAllSessions.pending, (state) => {
            state.sessionsLoading = true;
          })
          .addCase(getAllSessions.fulfilled, (state, action) => {
            state.sessionsLoading = false;
            state.sessions = action.payload as Session[];  
          })
          .addCase(getAllSessions.rejected, (state) => {
            state.sessionsLoading = false;
          })
          .addCase(deleteSession.pending, (state) => {
            state.sessionsLoading = true;
          })
          .addCase(deleteSession.fulfilled, (state, action) => {
            state.sessionsLoading = false;
            state.sessions = action.payload as Session[];
          })
          .addCase(deleteSession.rejected, (state) => {
            state.sessionsLoading = false;
          })
          .addCase(updateSession.pending, (state) => {
            state.sessionLoading = true;
          })
          .addCase(updateSession.fulfilled, (state) => {
            state.sessionLoading = false;
          })
          .addCase(getSession.pending, (state) => {
            state.sessionLoading = true;  
          })
            .addCase(getSession.fulfilled, (state, action) => {
            state.sessionLoading = false;
            state.session = action.payload as Session;
          })
    },
});

// Exportar acciones y reducer del slice
export const {
  setLoadingSessionDB, 
  setLoadingSessionsDB,
  clearTargetSession, 
  clearSessionData, 
  clearSessionsData,
  setSessionTypeModal,
  setSessionToggleModal,
  setTargetSession,
  setContext
} = sessionsSlice.actions;
export default sessionsSlice.reducer;