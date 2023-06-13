import { createSlice, createAction } from "@reduxjs/toolkit";
import { postOrderAnalysis } from "../../client/client";
import { dimensionEqual } from "../../helper/boxHelper";

// defines initial items for demonstration
import initalItemsArray from "./initialItems" 

const findById = (arr, id) => {
    return arr.filter(el => el.id === id)[0];
}

const initialState = {
    requestData: {
        items: initalItemsArray,
        algorithm: "LARGEST_AREA_FIT_FIRST",
        // TODO set this somewhere
        maxSizes: 5,
    },
    response: {
        data: null,
        loading: null,
        error: null,
    },
}

const fetchDataPending = createAction("orderApi/fetchData/pending");
const fetchDataSuccess = createAction("orderApi/fetchData/success");
const fetchDataRejected = createAction("orderApi/fetchData/rejected");

export const fetchData = () => {

    return (dispatch, getState) => {
        // get request data for THIS api
        const requestData = getState().orderApi.requestData;
        
        dispatch(fetchDataPending());


        return postOrderAnalysis(requestData).then(
            response => {
                dispatch(fetchDataSuccess({data: response.data}));
            },
            error => dispatch(fetchDataRejected({error: error.message})),
        );

    }

}

const orderApiSlice = createSlice({
    name: "orderApi", 
    initialState,
    reducers: {
        // added reducer (first one)
        setRequestDataMaxSizes(state, action) {
            state.requestData.maxSizes = action.payload;
        },
        setRequestDataAlgorithm(state, action) {
            state.requestData.algorithm = action.payload;
        },
        addRequestDataBox(state, action) {
            const box = action.payload;
            for (let item of state.requestData.items) {
                if (dimensionEqual(item, box)) {
                    item.count++;
                    return;
                }
            }

            state.requestData.items.push({
                // TODO make the box have an orderId
                orderId: box.orderId,
                id: state.requestData.items.length,
                x: box.x,
                y: box.y,
                z: box.z,
                count: 1,
                weight: 1,
            })
        },
        deleteLastRequestBox(state, action) {
            state.requestData.items.pop();
        },
        setRequestDataBoxAttr(state, action) {
            const {id, key, val} = action.payload;
            const item = findById(state.requestData.items, id);
            const parse = parseInt(val)
            item[key] = isNaN(parse) ? 0 : parse;
        },
        setRequestDataBoxes(state, action) {
            state.requestData.items = action.payload;
        },
        resetBoxes(state, action) {
            state.requestData.items = [];
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchDataPending, (state, action) => {
                state.response.loading = true;
            })
            .addCase(fetchDataSuccess, (state, action) => {
                state.response.loading = false;
                state.response.data = action.payload.data;
            })
            .addCase(fetchDataRejected, (state, action) => {
                state.response.loading = false;
                state.response.error = action.payload.error;
            })
    }
});

export default orderApiSlice.reducer;

export const {
    setRequestDataMaxSizes,
    setRequestDataAlgorithm,
    setRequestDataBoxes,
    addRequestDataBox,
    setRequestDataBoxAttr,
    deleteLastRequestBox,
    resetBoxes
} = orderApiSlice.actions;

// added selector (first one)
export const selectRequestDataMaxSizes = state => state.orderApi.requestData.maxSizes;
export const selectRequestDataAlgorithm = state => state.orderApi.requestData.algorithm;
export const selectRequestDataBoxes = state => state.orderApi.requestData.items;
export const selectResponse = state => state.orderApi.response;
export const selectRequestDataBoxById = (state, id) => state.orderApi.requestData.items[id];