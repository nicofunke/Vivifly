import React from 'react'
import { MDBIcon, MDBBtn, MDBInput } from 'mdbreact'

// Type for props and state
type PropsType = {
    back: () => void,
    proceed: (timeout: number) => void
}

type StateType = {
    timeout: number
}

/**
 * Component for the second time-based change window, to choose the timeout for the change
 */
export default class TimeChangeTimeout extends React.Component<PropsType, StateType> {

    state = { timeout: 1000 }

    /**
     * Handles changes on the timout input and stores the new value to state
     * @param event timeout input change event
     */
    handleChange(event: any){
        const value = event.target.value
        this.setState({timeout: value})
    }

    render() {
        return <>
            <p>
                The situation should change after
            </p>
            <div className="d-flex justify-content-center my-4">
                <div>
                    <MDBInput label="Timeout in ms" type="number" outline value={this.state.timeout} onChange={this.handleChange.bind(this)} autofocus/>
                    <small className="text-danger">
                        {this.state?.timeout > 0 || "Please choose a positive value"}</small>
                </div>
            </div>
            <div className="d-flex justify-content-between mt-2">
                <MDBBtn
                    color="light"
                    onClick={this.props.back}
                >
                    <MDBIcon icon="caret-left" className="mr-1" />
                    Back
                </MDBBtn>
                <MDBBtn
                    color="primary"
                    disabled={this.state.timeout <= 0}
                    onClick={() => this.props.proceed(this.state.timeout)}
                >
                    Proceed
                        <MDBIcon icon="caret-right" className="ml-1" />
                </MDBBtn>
            </div>
        </>
    }
}

