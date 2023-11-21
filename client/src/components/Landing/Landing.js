import React, { useRef } from 'react';
import { Layout, Model } from 'flexlayout-react';
import 'flexlayout-react/style/dark.css';
import Storage from '../Storage/Storage';
import View from '../View/View';
import Graph from '../Graph/Graph';

var json = {
    "global": {
        "tabEnableFloat": true,
        "tabSetMinWidth": 100,
        "tabSetMinHeight": 100,
        "borderMinSize": 100
    },
    "borders": [
    ],
    "layout": {
        "type": "row",
        "id": "#79d17072-67a1-480d-855f-0cfd86be7bdb",
        "children": [
            {
                "type": "row",
                "id": "#548a51d0-438a-40c0-80ef-a68b3a3ea725",
                "weight": 12.5,
                "children": [
                    {
                        "type": "tabset",
                        "id": "#3ed8153e-1bb6-478a-927d-d5c34a73dac1",
                        "weight": 50,
                        "children": [
                            {
                                "type": "tab",
                                "id": "#0feaf62e-305f-4971-8b29-f881ba67fed2",
                                "name": "STORAGE",
                                "component": "Storage"
                            },
                        ]
                    },
                    {
                        "type": "tabset",
                        "id": "#2ab44c1e-49a3-46ac-94c7-c3f51b48c6dc",
                        "weight": 50,
                        "children": [
                            {
                                "type": "tab",
                                "id": "#895ac56a-807e-4bf7-9922-034abd746ca8",
                                "name": "VIEW",
                                "component": "View",
                            }
                        ]
                    }
                ]
            },
            {
                "type": "tabset",
                "id": "#58616339-1440-4048-a048-114306773179",
                "weight": 25,
                "children": [
                    {
                        "type": "tab",
                        "id": "#f6f430ff-e235-4a8f-959d-d25a88be4368",
                        "name": "GRAPH",
                        "component": "Graph"
                    },
                ],
                "active": true
            }
        ]
    }
}

const model = Model.fromJson(json);

const Landing = () => {

    const layoutRef = useRef();
    let nextGridIndex = 1;

    const onRenderTabSet = (node, renderValues) => {
        renderValues.stickyButtons.push(
            <img src="images/add.svg"
                alt="Add"
                key="Add button"
                title="Add Tab (using onRenderTabSet callback, see Demo)"
                style={{ width: "1.1em", height: "1.1em" }}
                className="flexlayout__tab_toolbar_button"
                onClick={() => onAddFromTabSetButton(node)}
            />);
    }

    const onAddFromTabSetButton = (node) => {
        const addedTab = (layoutRef.current).addTabToTabSet(node.getId(), {
            component: "Graph",
            name: "GRAPH " + nextGridIndex++
        });
        console.log("Added tab", addedTab);
    }

    const factory = (node) => {
        var component = node.getComponent();

        if (component === "Storage") {
            return <Storage />;
        }

        if (component === "View") {
            return <View />;
        }

        if (component === "Graph") {
            return <Graph />;
        }
    }

    return (
        <div>
            <Layout
                ref={layoutRef}
                model={model}
                factory={factory}
                onRenderTabSet={onRenderTabSet}
            />
        </div>
    );
};

export default Landing;
