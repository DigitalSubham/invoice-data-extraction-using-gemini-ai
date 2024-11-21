import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    currentTab: "customer",
    dataSet: [],
  },

  reducers: {
    setDataForTable: (state, action) => {
      state.dataSet = action.payload;
    },
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    setEditDataAll: (state, action) => {
      const { data, currentTab, id } = action.payload;

      // Find the current key in dataSet that matches the currentTab
      const currentKey = Object.keys(state.dataSet).find((key) =>
        key.toLowerCase().includes(currentTab)
      );

      if (!currentKey) {
        console.error(`Tab "${currentTab}" not found in dataSet.`);
        return;
      }

      // Get the section of data based on the current key
      const dataSection = state.dataSet[currentKey];

      if (Array.isArray(dataSection)) {
        // If the section is an array, find the item by uniqueId or id
        const itemIndex = dataSection.findIndex((item) => item.uniqueId === id);

        if (itemIndex !== -1) {
          // Update the item with new data
          state.dataSet[currentKey][itemIndex] = {
            ...state.dataSet[currentKey][itemIndex],
            ...data,
          };
        } else {
          console.error(`Item with id "${id}" not found in ${currentKey}.`);
        }
      } else if (
        typeof dataSection === "object" &&
        dataSection.uniqueId === id
      ) {
        // If the section is an object and matches the id, update it
        state.dataSet[currentKey] = {
          ...dataSection,
          ...data,
        };
      } else {
        console.error(
          `No matching data found for id "${id}" in ${currentKey}.`
        );
      }

      console.log("Updated dataSet:", state.dataSet);
    },
  },
});

export const { setDataForTable, setCurrentTab, setEditDataAll } =
  dataSlice.actions;

export default dataSlice.reducer;
