import React from 'react'

export default function DisplayImageUploader(props: { currentImage: File | undefined, handleNewImage: ((event: React.ChangeEvent<HTMLInputElement>) => void) }) {
    return <>
        <div className="custom-file">
            <input type="file" className="custom-file-input" id="customFile" onChange={props.handleNewImage} />
            <label className="custom-file-label text-trim" htmlFor="customFile">
                {!!props.currentImage ? props.currentImage.name : "Choose image"}
            </label>
        </div>
    </>

}