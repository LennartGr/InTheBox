import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { selectResponse } from "../store/orderApiSlice/orderApiSlice";

import { Typography, Grid, Container, Button, ToggleButtonGroup, ToggleButton } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useState } from 'react'
import BinCard from "../view/OrderAnalysisResult/BinCard";


export function OrderAnalysisResult() {
    const response = useSelector(selectResponse);
    const data = response.data
    const navigate = useNavigate();

    // number of different sizes we're currently showing our recommandation for
    const [numberBoxes, setNumberBoxes] = useState(1);
    const [marketMode, setMarketMode] = useState(true);

    // case failure
    if (!data || !data.binRecommandations || data.binRecommandations.length === 0) {
        return <Box sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Typography sx={{ fontSize: "2rem", fontWeight: "700" }} align="center" color="textPrimary" gutterBottom>
                No Data Available
            </Typography>
            <Button variant="contained" onClick={() => navigate("/")} sx={{ marginTop: '20px' }}>Back Home</Button>
        </Box>;
    }

    // case data available
    const binRecommandations = marketMode ? response.data.marketBinRecommandations : response.data.binRecommandations
    const currentRecommandation = binRecommandations[numberBoxes]
    // handle case that market bin recommandation decorates normal one
    const currentBinRecommandation = marketMode ? currentRecommandation.binRecommandation : currentRecommandation

    // bin cards with different display depending on market recommandation or custom sized one
    const binCardGrid = (
        <Grid container spacing={4}>
            {currentBinRecommandation.bins.map((bin, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                    {marketMode ?
                        <BinCard bin={bin} isMarketBin={true} offerer={currentRecommandation.offererNames[index]} price={currentRecommandation.prices[index]} /> :
                        <BinCard bin={bin} isMarketBin={false} />}
                </Grid>
            ))}
        </Grid>)

    return (<>
        <Box
            sx={{
                backgroundColor: 'background.paper',
            }}>
            <Container maxWidth="md" align="center">
                <Typography sx={{ fontSize: "2.3rem", fontWeight: "700" }} align="center" color="textPrimary" gutterBottom>
                    Order Analysis Result
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    We provide both a recommandation based of bins available on the market 
                    as well as a recommandation where bin sizes are optimized freely.
                    If you choose the second option, your packaging will be even more effective in most cases!
                </Typography>
                <ToggleButtonGroup
                    color="primary"
                    value={marketMode}
                    exclusive
                    onChange={(event) => {setMarketMode(! marketMode)}}
                >
                    <ToggleButton value={true}>Market Sizes</ToggleButton>
                    <ToggleButton value={false}>Custom Sizes</ToggleButton>
                </ToggleButtonGroup>
                <Box
                    sx={{
                        margin: '20px',
                    }}>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item>
                            <Button variant="contained" onClick={() => setNumberBoxes(numberBoxes - 1)} disabled={numberBoxes <= 1}>
                                {"<<"}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Typography variant="h4">Using {numberBoxes} size{numberBoxes > 1 ? "s" : ""} </Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={() => setNumberBoxes(numberBoxes + 1)} disabled={numberBoxes >= binRecommandations.length - 1}>
                                {">>"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    The recommandation for this specific number of different sizes results in
                    an average <b>use of volume of {(currentBinRecommandation.volumeUsed * 100) | 0}%</b>
                </Typography>
            </Container>
        </Box>
        <Container sx={{ padding: '20px 0' }} maxWidth="md">
            {binCardGrid}
            <Button variant="contained" onClick={() => navigate("/")} sx={{ marginTop: '20px' }}>Back Home</Button>
        </Container>
    </>)
}