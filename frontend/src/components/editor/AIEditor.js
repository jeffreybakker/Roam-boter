import React, {Component} from "react";

import { withStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import RoamBotAPI from '../../RoamBotAPI'

import AIEditorMenu from "./AIEditorMenu";
import AICanvas from './AIEditor/ai_editor.js'

import {withRouter} from "react-router-dom"


//Component Styling
const styles = theme => ({
    AIEditor: {
        display: 'block',

        height: '100%',
        width: '100%',
        backgroundImage: 'url("/ai_editor_images/Seamless-Circuit-Board-Pattern.svg")',
        backgroundRepeat: 'repeat',
        backgroundSize: '4000px',
    },
    AIEditorGrid: {
        height: '100%'
    },
    AIEditorKonvaGridItem: {
        height: '100%',

        overflow: 'hidden'
    },
    AIEditorMenuGridItem: {
        height: '100%',

        backgroundColor: 'white',
        borderLeft: '1px solid rgba(0, 0, 0, 0.12)'
    }
})




class AIEditor extends Component {

    constructor(props) {
        super(props)

        /** Bind functions and resize */
        this.resize = this.resize.bind(this)
        this.handleAddCondition = this.handleAddCondition.bind(this)
        this.handleAddAction = this.handleAddAction.bind(this)
        this.handleSave = this.handleSave.bind(this)

        this.state = {
            id: null
        }
    }


    componentDidMount() {
        /** Konva Canvas */
        const canvas = new AICanvas('konva-container')
        this.canvas = canvas

        /** add resize listeners */
        window.addEventListener('resize', this.resize)
        window.addEventListener('load', this.resize)
        window.addEventListener('orientationchange', this.resize)
        this.resize()

        /** Add tree to the canvas if there's a parameter in the URL */
        const id = this.props.match.params.id;
        if (id) {
            this.fetchData(id)
                .then(() => this.setState({id: id}))
                .catch((error) => {
                    console.error(error)
                })
        }

    }

    componentDidUpdate() {
        this.resize()
    }


    resize() {
        /** Resizes the Konva Canvas */
        let konvaContainer = document.getElementById('konva-container')

        if (konvaContainer !== null) {
            let width = konvaContainer.offsetWidth
            let height = konvaContainer.offsetHeight
            this.canvas.resizeStage(width, height)
        }
    }

    handleAddCondition() {
        this.canvas.addCondition()
    }

    handleAddAction() {
        this.canvas.addActionNode()
    }

    handleSave() {
        // Save an AI
        let canvas = this.canvas
        let ai = canvas.treeToJson()
        let data = {}
        data.name = "saved-ai"
        data.ai = ai

        const response = (this.state.id) ? (RoamBotAPI.putAI(this.state.id, data)) : (RoamBotAPI.postAI(data))

        response.then((res) => {
            if (res.ok) {
                alert("AI Saved")
            } else {
                console.error(res)
                alert("An error occurred, see console.")
            }
        })

    }

    fetchData = async (id) => {
        // gets AI
        let response = await RoamBotAPI.getAiDetail(id)
        let json = await response.json()
        this.canvas.jsonToTree(JSON.parse(json.ai))
    }

    render() {
        // Get classes
        const { classes } = this.props

        let menuProps = {
            addConditionHandler: this.handleAddCondition,
            addActionHandler: this.handleAddAction,
            saveHandler: this.handleSave
        }

        return (
            <div id="AIEditor" className={classes.AIEditor}>
                <Grid container className={classes.AIEditorGrid}>

                    <Grid item xs={9} sm={9} className={classes.AIEditorKonvaGridItem}>
                        <Box id="konva-container" width={1} height={1}></Box>
                    </Grid>

                    <Grid item xs={3} sm={3} className={classes.AIEditorMenuGridItem}>
                        <AIEditorMenu {...menuProps} />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

/**
 * The component is exported with two hooks.
 * withRouter to allow accessing of url parameters in props
 * withStyles to allow for material-ui's makeStyles to work
 */
export default withRouter(withStyles(styles)(AIEditor))
