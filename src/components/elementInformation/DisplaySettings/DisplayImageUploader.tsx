import React from 'react'
import { useDropzone } from 'react-dropzone'
import { MDBIcon } from 'mdbreact'


export default function DisplayImageUploader(props: { uploadImage: ( (image: File) => void) }) {

    // TODO: Handling wrong file formats
    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        onDrop: files => props.uploadImage(files[0])
    })

    return <div {...getRootProps({ className: 'cursor-pointer grey-text shadow p-3 col-6 offset-3 dropzone mt-2' })}>
        <input {...getInputProps()} />
        <MDBIcon icon="cloud-upload-alt" size="2x" />
        <p className="mt-2">Drag 'n' drop a model here, or click to select a model</p>
    </div>

}