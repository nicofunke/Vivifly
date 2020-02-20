import React from 'react'

// Type for props
type PropsType = {
    onEnter?: () => void,
    onEsc?: () => void
}

export default class KeyListener extends React.Component<PropsType> {

    /**
     * Listener for key events. Triggers props methods on ESC or enter
     */
    onKeyPressed(event: any) {
        const keyCode = event.keyCode
        if(!!this.props.onEsc && keyCode === 27){
            this.props.onEsc()
        }
        if(!!this.props.onEnter && keyCode === 13){
            this.props.onEnter()
        }
    }

    /**
     * Start listening to keydown events after mounting
     */
    componentDidMount() {
        this.onKeyPressed = this.onKeyPressed.bind(this)    // Method needs to be binded here, otherwise the listener can't be removed
        document.addEventListener("keydown", this.onKeyPressed, false)
    }

    /**
     * Stop listening to keydown events on unmounting
     */
    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed, false)
    }

    render() {
        return null
    }
}
