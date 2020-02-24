import React from 'react'
import Unity from "react-unity-webgl"
import LoadingOverlay from './LoadingOverlay'
import UploadModelOverlay from './UploadModelOverlay'
import { UnityWrapper } from '../../Utils/UnityWrapper'

type PropsType = {
    unityWrapper?: UnityWrapper,
    modelWasUploaded: boolean,
    isCurrentlyUploading: boolean
}
export default class UnityScreen extends React.Component<PropsType> {

    render() {
        if( !this.props.unityWrapper){
            return null
        }
        return <>
            {this.props.modelWasUploaded || <UploadModelOverlay unityWrapper={this.props.unityWrapper} />}
            {this.props.isCurrentlyUploading && <LoadingOverlay message="Uploading model" />}
            <div className="position-absolute h-100 w-100 overflow-hidden">
                <div className="position-relative h-100 w-100">
                    <Unity  unityContent={this.props.unityWrapper.unityContent} />
                </div>
            </div>
        </>
    }
}
