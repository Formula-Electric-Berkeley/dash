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
    
    # relevant columns
    columns_to_keep = [
        "IVT-mod_extended_31082015::IVT_Msg_Result_U1::IVT_Result_U1[mV]",
        "IVT-mod_extended_31082015::IVT_Msg_Result_I::IVT_Result_I[mA]",
        "20170102 RMS PM CAN DB::M192_Command_Message::Torque_Command[Nm]",
        "20170102 RMS PM CAN DB::M173_Modulation_And_Flux_Info::D2_Flux_Weakening_Output[A]",
        "20170102 RMS PM CAN DB::M173_Modulation_And_Flux_Info::D3_Id_Command[A]",
        "20170102 RMS PM CAN DB::M173_Modulation_And_Flux_Info::D4_Iq_Command[A]",
        "20170102 RMS PM CAN DB::M172_Torque_And_Timer_Info::D1_Commanded_Torque[Nm]",
        "20170102 RMS PM CAN DB::M172_Torque_And_Timer_Info::D2_Torque_Feedback[Nm]",
        "20170102 RMS PM CAN DB::M168_Flux_ID_IQ_Info::D3_Id[A]",
        "20170102 RMS PM CAN DB::M168_Flux_ID_IQ_Info::D4_Iq[A]",
        "20170102 RMS PM CAN DB::M167_Voltage_Info::D1_DC_Bus_Voltage[V]",
        "20170102 RMS PM CAN DB::M167_Voltage_Info::D2_Output_Voltage[V]",
        "20170102 RMS PM CAN DB::M167_Voltage_Info::D3_VAB_Vd_Voltage[V]",
        "20170102 RMS PM CAN DB::M167_Voltage_Info::D4_VBC_Vq_Voltage[V]",
        "20170102 RMS PM CAN DB::M166_Current_Info::D4_DC_Bus_Current[A]",
        "20170102 RMS PM CAN DB::M165_Motor_Position_Info::D2_Motor_Speed[rpm]",
        "20170102 RMS PM CAN DB::M162_Temperature_Set_3::D4_Torque_Shudder[Nm]"
    ]
    
    df = pd.read_csv(filepath)
    
    output_df1 = pd.DataFrame()
    output_df2 = pd.DataFrame()
    
    time_column_indices = [i for i in range(0, len(df.columns), 3) if df.columns[i+1] in columns_to_keep]
    
    for i, time_col_index in enumerate(time_column_indices):
        time_col = df.columns[time_col_index]  # time
        data_col = df.columns[time_col_index + 1]  # data

        pair_df = df[[time_col, data_col]].copy()
        pair_df.columns = ['Timestamps', data_col]  
        
        pair_df.set_index('Timestamps', inplace=True)
        pair_df = pair_df.groupby('Timestamps').first()  # aggregate
    
        fill_value = -1 if ("torque_command" in data_col or "speed_command" in data_col) else 0
        pair_df = pair_df.ffill().fillna(fill_value)
        
        if i % 2 == 0:
            output_df1 = pd.concat([output_df1, pair_df], axis=1)
        else:
            output_df2 = pd.concat([output_df2, pair_df], axis=1)

    output_df1 = output_df1.sort_index().ffill().fillna({col: -1 if ("torque_command" in col or "speed_command" in col) else 0 for col in output_df1.columns})
    output_df2 = output_df2.sort_index().ffill().fillna({col: -1 if ("torque_command" in col or "speed_command" in col) else 0 for col in output_df2.columns})
    
    output_df1.to_csv(output_file1)
    output_df2.to_csv(output_file2)
