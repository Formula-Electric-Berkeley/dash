// all_run_data_json = JSON.parse("{{ data_headers_json }}".replaceAll("&#39;", "\"").replace(/ObjectId\("([^"]+)"\)/g, "\"$1\""))

graphData = []
graphDiv = document.getElementById('graph')
graphLayout = {
    font: {
        family: 'Inter, sans-serif',
        size: 16,
        color: '#fff'
    },
    margin: { t: 0, r: 0 },
    paper_bgcolor: "#000000",
    plot_bgcolor: "#000000",
    yaxis: {
        title: {
            text: 'VALUES',
        },
        zerolinecolor: "#fff",
        gridcolor: "gray",
        griddash: 'dot',
    },
    xaxis: {
        title: {
            text: 'TIME',
        },
        zeroline: false,
    },
    legend: {
        x: 1,
        xanchor: 'right',
        y: 1
    }
}

Plotly.newPlot(graphDiv, graphData, graphLayout)

function addSource() {
    let sourceValue = document.getElementById("source").value
    let deviceValue = document.getElementById("device").value
    let parameterValue = document.getElementById("parameter").value

    if (sourceValue && deviceValue && parameterValue) {
        fetch('./graph', {
            method: 'POST',
            body: JSON.stringify({
                "source": sourceValue,
                "device": deviceValue,
                "parameter": parameterValue
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            graphData.push({
                x: data["timestamps"],
                y: data["data"],
                name: data["name"],
            })

            Plotly.update(graphDiv, graphData, graphLayout)
        });
    }
}

for (var key in all_run_data_json) {
    run = all_run_data_json[key]

    var opt = document.createElement('option');
    opt.value = run["_id"];
    opt.innerHTML = run["name"];

    document.getElementById("source").appendChild(opt);
}

function updateSelect(selectID, jsonKey) {
    deviceSelector = document.getElementById(selectID)

    if (deviceSelector.children.length > 0) {
        for (let i = 1; i <= deviceSelector.children.length; i++) {
            if (deviceSelector[i]) deviceSelector.removeChild(deviceSelector[i]);
        }
    }

    for (var key in all_run_data_json) {
        run = all_run_data_json[key]

        if (run["_id"] == document.getElementById("source").value) {
            for (var i in run[jsonKey]) {
                var opt = document.createElement('option');
                opt.value = run[jsonKey][i];
                opt.innerHTML = run[jsonKey][i];

                deviceSelector.appendChild(opt);
            }
        }
    }
}
