# imports
import json
import pandas as pd
import csv

# def parse_csv(filepath):
#     df = pd.read_csv(filepath)

#     # dictionary
#     data = {"devices": [], "params": [], "param_data": {}}

#     # loop through each row
#     for index, row in df.iterrows():
#         device = row["Device"]
#         param = row["Message"]
#         data_values = [row["Timestamps"], row["Data"]]

#         if device not in data["devices"]:
#             data["devices"].append(device)

#         if param not in data["params"]:
#             data["params"].append(param)

#         if param not in data["param_data"]:
#             data["param_data"][param] = {"timestamps": [], "data": []}

#         data["param_data"][param]["timestamps"].append(data_values[0])
#         data["param_data"][param]["data"].append(data_values[1])

#     # just for easy viewing
#     # output = json.dumps(data, indent=2)
#     # print(output)

#     return data

# take in data dictionary and empty csv file and update the csv file with relevant data
def dict_to_csv(data, output_file):
    # get data parameters
    devices = data["devices"]
    params = data["params"]
    param_data = data["param_data"]
    
    # store csv rows
    csv_data = []
    
    # headers at the top of the file (following the format)
    header = ["Timestamps", "Device", "Message", "Data"]
    csv_data.append(header)
    
    # loop through data dictionary and create row
    for device in devices:
        for param in params:
            if param in param_data:
                timestamps = param_data[param]['timestamps']
                data_values = param_data[param]['data']
                for i in range(len(timestamps)):
                    row = [timestamps[i], device, param, data_values[i]]
                    csv_data.append(row)
    
    # write to csv file
    with open(output_file, 'w', newline='') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerows(csv_data)


"""example test case for creating csv
data = {
    "devices": ["BMS"],
    "params": ["BMS_TEMPERATURE", "BMS_VOLTAGE", "BMS_SOMETHING"],
    "param_data": {
        "BMS_TEMPERATURE": {
                "timestamps": [0.0, 1.0, 2.0],
                "data": [4.0, 5.0, 6.0]
        },
        "BMS_VOLTAGE": {
                "timestamps": [0.0, 1.0, 2.0],
                "data": [600.0, 550.0, 500.0]
        },
        "BMS_SOMETHING": {
                "timestamps": [0.0, 1.0, 2.0],
                "data": [200.0, 250.0, 300.0]
        }
    }
}
output_file = 'output.csv' 
dict_to_csv(data, output_file) # output file should now have newly updated csv
"""

def parse_csv(filepath):
    df = pd.read_csv(filepath)

    data = {}

    data["parameters"] = []

    for col in df:
        if col == "Time":
            data["timestamps"] = df[col].to_list()
        elif col == "DeviceName":
            data["devices"] = list(set(df[col].to_list()))
        else:
            data["parameters"].append(col)
            data[str(col)] = df[col].to_list()

    return data