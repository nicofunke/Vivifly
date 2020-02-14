import React from 'react'

type propsType = {
    currentImage: File | undefined,
    handleNewImage: ((event: React.ChangeEvent<HTMLInputElement>) => void),
    wrongFileTypeSubmitted: boolean
}

export default function DisplayImageUploader(props: propsType) {
    return <>
        <div className="custom-file">
            <input type="file" className="custom-file-input" id="customFile" onChange={props.handleNewImage} accept="image/*" />
            <label className="custom-file-label text-trim" htmlFor="customFile">
                {!!props.currentImage ? props.currentImage.name : "Choose image"}
            </label>
        </div>
        {props.wrongFileTypeSubmitted
            && <><small className="text-danger">Please choose a non-transparent JPG or PNG file smaller than 2MB</small><br /></>}

    </>

}