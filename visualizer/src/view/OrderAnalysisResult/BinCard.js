import React from 'react';
import { Box, Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import BinThreeJS from './BinThreeJS';

export default function BinCard(props) {

    const additionalInfo = props.isMarketBin ?
        (<>
            <Typography>
                offerer: {props.offerer} <br />
                price: {props.price}€
            </Typography>
        </>) :
        (<></>)


    return (
        <Card>
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <BinThreeJS bin={props.bin} width={250} height={250} />
                </Box>
                <Typography>
                    x: {props.bin.x} cm<br />
                    y: {props.bin.y} cm<br />
                    z: {props.bin.z} cm
                </Typography>
                {additionalInfo}
            </CardContent>
            <CardActions>
                <Button size="small" color="primary">
                    { props.isMarketBin ? "Shop online" : "Contact manufacturer" }
                </Button>
            </CardActions>
        </Card>
    );
};

