# imports
import pandas as pd
import json
import os
import uuid

# csv
# temporarily asking for csv_file (probably would change based on how the upload data form is submitted)
csv_file = input("File name: ")
filename = os.path.basename(csv_file)

# temporarily asking for name of file (probably would change based on how the upload data form is submitted)
name = input("Enter a name: ")
# generate a random id
object_id = str(uuid.uuid4())
#read file
df = pd.read_csv(csv_file_path)

# dictionary
data = {
    "_id": f"ObjectId('{object_id}')",
    "name": name,
    "filename": filename,
    "devices": [],
    "params": [],
    "param_data": {}
}

# loop through each row
for index, row in df.iterrows():
    device = row['Device']
    param = row['Message']
    data_values = [row['Timestamps'], row['Data']]
    
    if device not in data["devices"]:
        data["devices"].append(device)
    
    if param not in data["params"]:
        data["params"].append(param)
    
    if param not in data["param_data"]:
        data["param_data"][param] = {'timestamps': [], 'data': []}
    
    data["param_data"][param]['timestamps'].append(data_values[0])
    data["param_data"][param]['data'].append(data_values[1])

# just for easy viewing
output = json.dumps(data, indent=2)
print(output)