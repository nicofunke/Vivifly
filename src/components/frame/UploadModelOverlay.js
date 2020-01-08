import React from 'react'
import { useDropzone } from 'react-dropzone'
import { MDBIcon } from 'mdbreact'
import Logo from '../../assets/logo_font.png'

export default function UploadModelOverlay(props) {
    // TODO: Handling wrong file formats
    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        onDrop: files => props.insertFileModel(files[0])
    })

    return <>
        <div className="position-fixed h-100 w-100 overflow-hidden bg-white upload-overlay">
            <div className="row h-100">
                <div className="col-12 my-auto text-center">
                    <div className="text-center col-12 mb-4"> <img src={Logo} alt="Logo" height="80px" /></div>
                    <div {...getRootProps({ className: 'cursor-pointer grey-text shadow p-3 col-6 offset-3 dropzone mt-2' })}>
                        <input {...getInputProps()} />
                        <MDBIcon icon="cloud-upload-alt" size="2x" />
                        <p className="mt-2">Drag 'n' drop a model here, or click to select a model</p>
                    </div>
                </div>
            </div>
        </div>
    </>
}
