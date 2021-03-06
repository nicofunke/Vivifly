import React from 'react'

type PropsType = {
    message: string
}

export default class LoadingOverlay extends React.Component<PropsType> {
    render() {
        return <>
            <div className="position-fixed h-100 w-100 overflow-hidden bg-backdrop loading-overlay">
                <div className="row h-100">
                    <div className="col-12 my-auto text-center text-white">
                        <div>{this.props.message}</div>
                        <div className="spinner-border text-primary mt-2" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}