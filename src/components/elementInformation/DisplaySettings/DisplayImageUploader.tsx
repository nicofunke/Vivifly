import React from 'react'

type propsType = {
    currentImage: File | undefined,
    handleNewImage: ((image: File) => void)
}

type StateType={
    wrongFileTypeSubmitted: boolean
}

/**
 * Component to upload image files for screens
 */
export default class DisplayImageUploader extends React.Component<propsType, StateType> {

    // default state
    state = { wrongFileTypeSubmitted: false }

    /**
     * Gets called if new files are chosen. Checks for the correct format and either displays a wrong
     * format message or sends the file to the parent component 
     * @param event Change event of the file input field
     */
    handleNewFiles(event: React.ChangeEvent<HTMLInputElement>) {
        // Stop if no files chosen
        if (!event.target.files) {
            return
        }
        const file = event.target.files[0]
        // Check if file is image
        if (file.type.split('/')[0] !== 'image' || file.size > 2000000) {
            this.setState({ wrongFileTypeSubmitted: true })
            return
        }
        this.setState({ wrongFileTypeSubmitted: false })
        this.props.handleNewImage(file)
    }

    render() {
        return <>
            <div className="custom-file">
                <input type="file" className="custom-file-input" id="customFile" onChange={this.handleNewFiles.bind(this)} accept="image/*" />
                <label className="custom-file-label text-trim" htmlFor="customFile">
                    {!!this.props.currentImage ? this.props.currentImage.name : "Choose image"}
                </label>
            </div>
            {this.state.wrongFileTypeSubmitted
                && <><small className="text-danger">Please choose a non-transparent JPG or PNG file smaller than 2MB</small><br /></>}
        </>
    }
}