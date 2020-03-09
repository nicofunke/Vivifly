import { AppContext } from '../interfaces/app-context.interface';
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { VISUALIZATION_TYPE_SCREEN } from '../types/visualization-type.type'
import { ContextUtils } from './ContextUtils';

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
     * Converts the states of the current context into the zip directories
     */
    private convertStates() {
        let imageFiles: File[] = []
        const output = {
            States: this.context.states.map(state => {
                return {
                    ...state,
                    // Delete state ID
                    id: undefined,
                    Values: state.Values?.map(value => {
                        // Replace image files with image name
                        if (value.Type === VISUALIZATION_TYPE_SCREEN) {
                            imageFiles = !!value.File ? [...imageFiles, value.File] : imageFiles
                            return { ...value, File: undefined, FileName: value.File?.name }
                        } else {
                            return value
                        }
                    })
                }
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