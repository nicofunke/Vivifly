import React from 'react'
import * as SRD from "storm-react-diagrams"
require('storm-react-diagrams/dist/style.min.css')

class DiagramScreen extends React.Component {

    constructor() {
        super()
        // 1) setup the diagram engine
        this.engine = new SRD.DiagramEngine();
        this.engine.installDefaultFactories();

        // 2) setup the diagram model
        var model = new SRD.DiagramModel();

        // 3) create a default node
        var node1 = new SRD.DefaultNodeModel("Start", "rgb(0,192,255)");
        let port1 = node1.addOutPort("Default");
        let port2 = node1.addOutPort("Clicked");
        node1.setPosition(100, 100);

        // 4) create another default node
        var node2 = new SRD.DefaultNodeModel("Coffee selected", "rgb(192,255,0)");
        let port3 = node2.addInPort("Default");
        node2.setPosition(400, 100);

        // 5) link the ports
        let link1 = port1.link(port3);

        // 6) add the models to the root graph
        model.addAll(node1, node2, link1);

        // 7) load model into engine
        this.engine.setDiagramModel(model);
    }

    render() {
        return (
            <SRD.DiagramWidget diagramEngine={this.engine} className="h-100"/>
        )
    }
}

export default DiagramScreen

