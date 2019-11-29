import React from 'react'
import SituationsListElement from './SituationsListElement'

class SituationsList extends React.Component {

    render() {

        return (
            <div className=" h-100 w-100 bg-white">
                <div className="special-color-dark text-light w-100 p-2">
                    <h2>Situations</h2>
                </div>
                {this.renderSituationList()}
            </div>
        )
    }

    renderSituationList(situations) {
        const listElements = []
        for (const situation of this.props.situations) {
            listElements.push(
                <SituationsListElement 
                    name={situation.name} 
                    setSituation={() =>this.props.setSituation(situation.name)}
                    isSelected={situation.name === this.props.currentSituation} />)
        }
        return (
            <div>
                {listElements}
            </div>
        )
    }
}

export default SituationsList