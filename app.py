# https://github.com/haudquaquam/feb_recruitment

from flask import Flask, render_template
import pandas as pd
import json
import plotly
import plotly.express as px
import plotly.graph_objs as go


app = Flask(__name__)

# Process CSV into multiple CSVs based on Message. https://stackoverflow.com/questions/46847803/splitting-csv-file-based-on-a-particular-column-using-python
# Creates new CSV files, returns the list of new file names.
def process_csv(): 
    data = pd.read_csv("data/dataset.csv")

    data_category_range = data['Message'].unique()
    data_category_range = data_category_range.tolist()

    for i,value in enumerate(data_category_range):
        data[data['Message'] == value].to_csv(r'data/Message_'+str(value)+r'.csv',index = False, na_rep = 'N/A')

@app.route('/')
def index():
    df = pd.read_csv('data/dataset.csv')
    return render_template('index.html', data=df)

@app.route('/chart')
def chart1():
    process_csv()
    df = pd.read_csv('data/Message_BMS_Temperature.csv')
    df2 = pd.read_csv('data/Message_BMS_Voltage.csv')

    fig = px.line(df, x="Data", y="Timestamps", color="Message") # BMS Temperature Data
    fig.update_traces(line_color='green')
    fig.add_trace(px.line(df2, x="Timestamps", y="Data", color="Message").data[0]) # BMS Voltage Data

    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    header="BMS Voltage vs. Temperature Over Time"
    description = """
    Using sample data from 8-21-22, this graph displays BMS voltage and temperature data over time.
    """
    return render_template('chart.html', graphJSON=graphJSON, header=header,description=description)

