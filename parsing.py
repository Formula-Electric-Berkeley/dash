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

def parse_can(filepath, output_file1, output_file2):
    
    df = pd.read_csv(filepath)
    
    # output dataframes
    output_df1 = pd.DataFrame()
    output_df2 = pd.DataFrame()
    
    # (there is a blank column between each time data pair)
    time_column_indices = list(range(0, len(df.columns), 3))
    
    for i, time_col_index in enumerate(time_column_indices):
        time_col = df.columns[time_col_index] # time column
        data_col = df.columns[time_col_index + 1] # data column

        # new dataframe for just the time and col
        pair_df = df[[time_col, data_col]]
        pair_df.columns = ['Timestamps', data_col] # name of column
    
        pair_df.set_index('Timestamps', inplace=True) # index = Timestamp
        pair_df = pair_df.groupby('Timestamps').first() # aggregate times and data points that have entry for time
        
        # Determine fill value based on column name
        fill_value = -1 if ("torque_command" in data_col or "speed_command" in data_col) else 0

        # Fill any empty cells with the last recorded value, and if none exists, fill with determined value
        pair_df = pair_df.ffill().fillna(fill_value)
    
        # Alternate between output_df1 and output_df2
        if i % 2 == 0:
            output_df1 = pd.concat([output_df1, pair_df], axis=1)
        else:
            output_df2 = pd.concat([output_df2, pair_df], axis=1)

    # sort ascending order by time and fill the empty cells for the final dataframes
    output_df1 = output_df1.sort_index().ffill().fillna({col: -1 if ("torque_command" in col or "speed_command" in col) else 0 for col in output_df1.columns})
    output_df2 = output_df2.sort_index().ffill().fillna({col: -1 if ("torque_command" in col or "speed_command" in col) else 0 for col in output_df2.columns})

    # output to separate files
    output_df1.to_csv(output_file1)
    output_df2.to_csv(output_file2)