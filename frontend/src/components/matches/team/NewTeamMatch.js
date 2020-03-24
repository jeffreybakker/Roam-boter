import React, { useEffect, useState } from 'react'

import { Typography, Grid, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import ContentBox from '../../layout/ContentBox'
import SelectAIDialog from '../SelectAIDialog'

import RoamBotAPI from '../../../RoamBotAPI'


const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
    },
    button: {
        margin: '0.5rem 0',
    }
}))

const NewTeamMatch = props => {

    const classes = useStyles()

    let [ais, setAis] = useState(null)
    let [selectAIOpen, setSelectAIOpen] = useState(false)
    let [selectedAI, setSelectedAI] = useState(null)

    useEffect(() => {
        async function updateAis() {
            let call = await RoamBotAPI.getAiList()
            let json = await call.json()
            setAis(json)
        }

        if (ais === null) {
            updateAis()
        }
    })

    const playMatch = async () => {
        //TODO:
    }

    const handleAIListItemClick = (ai) => {
        setSelectedAI(ai)
        setSelectAIOpen(false)
    }



    return (
         <ContentBox>
            <Typography variant="h4" align="center">New Team Match</Typography>
            <Grid container justify="center" spacing={2}>
                <Grid item xs={12} sm={9} md={6}>
                    <div className={classes.wrapper}>

                        <Button className={classes.button} variant="outlined" color={selectedAI ? "primary" : "secondary"} onClick={() => {
                            setSelectAIOpen(true)
                        }}>
                            {selectedAI ? selectedAI.name : "Select AI"}
                        </Button>

                        <Button className={classes.button} type="submit" variant="contained" disabled={!(selectedAI)} color="secondary" onClick={playMatch}>Play</Button>

                        {(ais) ? (<SelectAIDialog ais={ais} open={selectAIOpen} handleClose={() => setSelectAIOpen(false)} handleClick={handleAIListItemClick} />) : "no AIs found"}
                    </div>
                </Grid>
            </Grid>
        </ContentBox>
    )
}

export default NewTeamMatch