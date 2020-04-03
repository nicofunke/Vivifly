import { AppContext } from '../interfaces/app-context.interface'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { VISUALIZATION_TYPE_SCREEN, VISUALIZATION_TYPE_FLOAT } from '../types/visualization-type.type'
import { ContextUtils } from './ContextUtils'
import { VisualizationCondition } from '../interfaces/visualization-condition.interface'

// TODO: (prio) Handle duplicate image names

/**
 * Class to export models
 */
export class ModelExport {

    private context: AppContext
    private zip: JSZip
    private screensZip: JSZip
    private specZip: JSZip

    /**
     * Creates a new ModelExport instance
     * @param context context that is used for the export
     */
    constructor(context: AppContext) {
        this.context = context
        this.zip = new JSZip()
        this.specZip = this.zip.folder("FunctionalSpecification")
        this.screensZip = this.zip.folder("Screens")
    }

    /**
     * Converts the current context of the object to zip and starts zip download
     */
    startModelDownload() {
        this.initializeZipDirectories()
        this.convertStates()
        this.convertTransitions()
        this.convertVisualizations()
        this.convertInteractions()
        this.zip.generateAsync({ type: "blob" })
            .then((zipFile) => {
                saveAs(zipFile, "model.zip");
            })
    }

    /**
     * Initializes the necessary zip directories as empty folders
     */
    private initializeZipDirectories() {
        this.zip = new JSZip()
        this.specZip = this.zip.folder("FunctionalSpecification")
        this.screensZip = this.zip.folder("Screens")
    }


    /**
     * Converts the interaction elements of the current context into the zip directories
     */
    private convertInteractions() {
        const output = {
            Elements: [...this.context.interactionElements]
        }

        // Store interaction Specification in spec folder
        this.specZip.file("InteractionElements.json", JSON.stringify(output))
    }

    /**
     * Converts the visualization elements of the current context into the zip directories
     */
    private convertVisualizations() {
        const output = {
            Elements: [...this.context.visualizationElements]
        }

        // Store visualization Specification in spec folder
        this.specZip.file("VisualizationArrays.json", "{\"Elements\": []}")
        this.specZip.file("VisualizationElements.json", JSON.stringify(output))
    }

    /**
     * Converts the transitions of the current context into the zip directories
     */
    private convertTransitions() {
        const output = {
            Transitions: this.context.transitions.map(transition => {
                if (transition.SourceStateID === undefined || transition.DestinationStateID === undefined) {
                    // Source or Destination missing
                    return undefined
                }
                // Convert situation IDs to names
                return {
                    ...transition,
                    SourceStateID: undefined,
                    SourceState: ContextUtils.getSituationName(transition.SourceStateID, this.context.states),
                    DestinationStateID: undefined,
                    DestinationState: ContextUtils.getSituationName(transition.DestinationStateID, this.context.states)
                }
            })
        }

        // Filter empty transitions
        output.Transitions = output.Transitions.filter(transition => transition !== undefined)

        // Store transition Specification in spec folder
        this.specZip.file("Transitions.json", JSON.stringify(output))
    }

    /**
     * Converts the states of the current context as JSON into the zip directory
     */
    private convertStates() {

        // Set image files 
        let imageFiles: File[] = []
        const visualizationElements: string[] = this.context.visualizationElements.map(element => element.Name)
        let output = {
            States: this.context.states.map(state => {
                let exportState: any = { ...state }
                // Remove temporary state id
                exportState.id = undefined

                // Replace image files with file names
                exportState.Conditions = !!state.Conditions ?
                    state.Conditions.map(condition => {
                        if (condition.Type === VISUALIZATION_TYPE_SCREEN) {
                            imageFiles = !!condition.File ? [...imageFiles, condition.File] : imageFiles
                            return { ...condition, File: undefined, FileName: condition.File?.name }
                        } else {
                            return condition
                        }
                    }) : []

                // Replace missing visualization values with zero values
                const elementsWithCondition = exportState.Conditions.map(
                    (condition: VisualizationCondition) => condition.VisualizationElement)
                let missingVisualizationElements = visualizationElements.filter(
                    visualizationElement => !elementsWithCondition.includes(visualizationElement))
                missingVisualizationElements.forEach(elementName => {
                    exportState.Conditions?.push({
                        VisualizationElement: elementName,
                        Type: VISUALIZATION_TYPE_FLOAT,
                        Value: 0
                    })
                })

                return exportState
            })
        }

        // Set start situation (as first situation in list)
        const start = output.States.find(state => state.isStart)
        if (!!start) {
            output.States = output.States.filter(state => !state.isStart)
            output.States = [{ ...start, isStart: undefined }, ...output.States]
        }

        // Store images in "screens" folder
        for (const imageFile of imageFiles) {
            this.screensZip.file(imageFile.name, imageFile)
        }

        // Store state Specification in spec folder
        this.specZip.file("States.json", JSON.stringify(output))
    }
}