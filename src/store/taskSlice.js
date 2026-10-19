import {createSlice} from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
});
export const {setTasks} = taskSlice.actions;
export default taskSlice.reducer;