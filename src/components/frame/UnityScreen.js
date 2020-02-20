import React from 'react'
import Unity from "react-unity-webgl"
import LoadingOverlay from './LoadingOverlay'
import UploadModelOverlay from './UploadModelOverlay'
import { AppContext } from '../Application/AppContext'

export default class UnityScreen extends React.Component {

    static contextType = AppContext

    render() {
        if( !this.context.unityWrapper){
            return null
        }
        return <>
            {this.context.applicationState.modelWasUploaded || <UploadModelOverlay unityWrapper={this.context.unityWrapper} />}
            {this.context.applicationState.isCurrentlyUploading && <LoadingOverlay message="Uploading model" />}
            <div className="position-absolute h-100 w-100 overflow-hidden">
                <div className="position-relative h-100 w-100">
                    <Unity style={{ minHeight: "100vh", minWidth: "100vw" }} unityContent={this.context.unityWrapper.unityContent} />
                </div>
            </div>
        </>
    }
}
