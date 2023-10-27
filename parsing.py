import pandas as pd
import csv

def parse_csv(filepath):
    df = pd.read_csv(filepath)

    # dictionary
    data = {"devices": [], "params": [], "param_data": {}}

    # loop through each row
    for index, row in df.iterrows():
        device = row["Device"]
        param = row["Message"]
        data_values = [row["Timestamps"], row["Data"]]

        if param not in data["params"]: 
            data["params"].append(param)

        if device not in data["devices"]:
            data["devices"].append(device)

        if device not in data["param_data"]:
            data["param_data"][device] = {}

        if param not in data["param_data"][device]:
            data["param_data"][device][param] = {"timestamps": [], "data": []}

        # add device subsection
        data["param_data"][device][param]["timestamps"].append(data_values[0])
        data["param_data"][device][param]["data"].append(data_values[1])

    # just for easy viewing
    # output = json.dumps(data, indent=2)
    # print(output)

    return data

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
        if device in param_data:
            for param in params:
                if param in param_data[device]:
                    timestamps = param_data[device][param]['timestamps']
                    data_values = param_data[device][param]['data']
                    for i in range(len(timestamps)):
                        row = [timestamps[i], device, param, data_values[i]]
                        csv_data.append(row)
    
    # write to csv file
    with open(output_file, 'w', newline='') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerows(csv_data)


# CAN refactor

def parse_can(filepath, output_file):

    df = pd.read_csv(filepath) 
    # delete first 6 columns (torque command, speed command)
    df = df.iloc[:, 6:]
    
    # output dataframe
    output_df = pd.DataFrame()
    
    # (there is a blank column between each time data pair)
    time_column_indices = list(range(0, len(df.columns), 3))
    
    # iterate over each time and look at respective data (next column over)
    for time_col_index in time_column_indices:
        time_col = df.columns[time_col_index] # time column
        data_col = df.columns[time_col_index + 1] # data column
    
        # new dataframe for just the time and col
        pair_df = df[[time_col, data_col]]
        pair_df.columns = ['Timestamps', data_col] # name of column
    
        pair_df.set_index('Timestamps', inplace=True) # index = Timestamp
        pair_df = pair_df.groupby('Timestamps').first() # aggregate times and data points that have entry for time
    
        output_df = pd.concat([output_df, pair_df], axis=1) # 
    # sort ascending order by time
    output_df = output_df.sort_index()
    # output file
    output_df.to_csv(output_file)