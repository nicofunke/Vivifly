import React from 'react'

// Type for props
type PropsType = {
    onEnter?: () => void,
    onEsc?: () => void,
    onMouseClick?: () => void
}

export default class KeyListener extends React.Component<PropsType> {

    /**
     * Listener for key events. Triggers props methods on ESC or enter
     */
    onKeyPressed(event: any) {
        const keyCode = event.keyCode
        if (!!this.props.onEsc && keyCode === 27) {
            this.props.onEsc()
        }
        if (!!this.props.onEnter && keyCode === 13) {
            this.props.onEnter()
        }
    }

    /**
     * Listener for mouseClicks. Triggers the props method
     */
    onClick() {
        if (!!this.props.onMouseClick) {
            this.props.onMouseClick()
        }
    }

    /**
     * Start listening to keydown events after mounting
     */
    componentDidMount() {
        this.onKeyPressed = this.onKeyPressed.bind(this)    // Methods need to be binded here, otherwise the listener can't be removed
        this.onClick = this.onClick.bind(this)     
        document.addEventListener("keydown", this.onKeyPressed, false)
        document.addEventListener("click", this.onClick, false)
    }

    /**
     * Stop listening to keydown events on unmounting
     */
    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed, false)
        document.removeEventListener("click", this.onClick, false )
    }

    render() {
        return null
    }
}
