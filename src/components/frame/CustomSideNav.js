import React from 'react'

class CustomSideNav extends React.Component {
    render() {
        return (
            <div className="special-color-dark text-light h-100 w-100 text-center p-2">
                <h2>LOGO</h2>
                <div className="m-2">
                    Elements
                </div>
                <div className="m-2">
                    Transitions
                </div>
                <div className="m-2">
                    Export
                </div>
            </div>
        )
    }
}

export default CustomSideNav