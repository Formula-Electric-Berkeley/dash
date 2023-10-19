# imports
import pandas as pd


def parse_csv(filepath):
    df = pd.read_csv(filepath)

    # dictionary
    data = {"devices": [], "params": [], "param_data": {}}

    # loop through each row
    for index, row in df.iterrows():
        device = row["Device"]
        param = row["Message"]
        data_values = [row["Timestamps"], row["Data"]]

        if device not in data["devices"]:
            data["devices"].append(device)

        if param not in data["params"]:
            data["params"].append(param)

        if param not in data["param_data"]:
            data["param_data"][param] = {"timestamps": [], "data": []}

        data["param_data"][param]["timestamps"].append(data_values[0])
        data["param_data"][param]["data"].append(data_values[1])

    # just for easy viewing
    # output = json.dumps(data, indent=2)
    # print(output)

    return data
