import { TextField, Button, Typography, Box } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequestDataBox, deleteLastRequestBox, selectRequestDataBoxes, setRequestDataBoxAttr } from "../../store/orderApiSlice/orderApiSlice";

const findById = (arr, id) => {
    return arr.filter(el => el.id === id)[0];
}

export function DynamicFormReduxOrderApi(props) {
    const formState = useSelector(selectRequestDataBoxes);

    const dispatch = useDispatch();

    const formBoxLine = (id) => ([
        <TextField onChange={(e) => dispatch(setRequestDataBoxAttr({id, key: "orderId", val: e.target.value}))} id={`orderId-${id}`} key={`orderId-${id}`} label="Order ID" variant="outlined" value={findById(formState, id).orderId}/>,
        <TextField onChange={(e) => dispatch(setRequestDataBoxAttr({id, key: "count", val: e.target.value}))} id={`count-${id}`} key={`count-${id}`} label="Count" variant="outlined" value={findById(formState, id).count}/>,
        <TextField onChange={(e) => dispatch(setRequestDataBoxAttr({id, key: "x", val: e.target.value}))} id={`x-${id}`} key={`x-${id}`} label="x (cm)" variant="outlined" value={findById(formState, id).x}/>,
        <TextField onChange={(e) => dispatch(setRequestDataBoxAttr({id, key: "y", val: e.target.value}))} id={`y-${id}`} key={`y-${id}`} label="y (cm)" variant="outlined" value={findById(formState, id).y}/>,
        <TextField onChange={(e) => dispatch(setRequestDataBoxAttr({id, key: "z", val: e.target.value}))} id={`z-${id}`} key={`z-${id}`} label="z (cm)" variant="outlined" value={findById(formState, id).z}/>,
        <TextField onChange={(e) => dispatch(setRequestDataBoxAttr({id, key: "weight", val: e.target.value}))} id={`weight-${id}`} key={`weight-${id}`} label="Weight (gramm)" variant="outlined" value={findById(formState, id).weight}/>,
    ]);

    const handleAddRow = () => {
        dispatch(addRequestDataBox({}));
    }

    const deleteLastRow = () => {
        dispatch(deleteLastRequestBox());
    }

    return (<>
            <Typography sx={{fontSize: "2rem", fontWeight: "700"}}>{props.title}</Typography>
            <Box
                component="form"
                style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", columnGap: "1%", rowGap: "10px"}}
            >
                {formState.map(state => formBoxLine(state.id))}
                
            </Box>



            <div style={{display: 'grid', gridTemplateColumns: '15% 15% 51% 14%', columnGap: "1%"}}>
                <Button 
                    variant="contained" 
                    onClick={deleteLastRow}
                    sx={{marginTop: `10px`, marginRight: "1%"}}
                    color="error"
                    disabled={formState.length === 0}
                    >
                    Delete Last Order Item
                </Button>

                <Button 
                    variant="contained" 
                    onClick={handleAddRow}
                    sx={{marginTop: `10px`, marginRight: "1%"}}
                    >
                    Add Order Item
                </Button> 
                
                <div></div>

                { /*deleted button scan box here */}

                <Button 
                    variant="contained" 
                    onClick={props.onSubmit}
                    sx={{marginTop: `10px`, type: "submit"}}
                    color="success"
                    >
                    Submit
                </Button> 
            </div>
        </>
    )
}