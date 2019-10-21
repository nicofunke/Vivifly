import React from 'react'

class CustomSideNav extends React.Component {
    render() {
        return (
            <div className="special-color-dark text-light h-100 text-center position-fixed p-3">
                <h2>WebGL-States</h2>
                <div className="m-2">
                    Elements
                </div>
                <div className="m-2">
                    States
                </div>
                <div className="m-2">
                    Interactions
                </div>
            </div>
        )
    }
}

export default CustomSideNav