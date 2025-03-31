from flask import Flask, render_template
from flask_socketio import SocketIO
import tclab
import time
import threading

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

tclab_object = None
tclab_connected = False
thread_connection = None
thread_update = None

def check_tclab_connection():
    global tclab_connected, tclab_object
    while True:
        try:
            if not tclab_connected:
                tclab_object = tclab.TCLab()
                tclab_connected = True
            tclab_object.LED(20) 
        except:
            if tclab_connected:
                tclab_connected = False
                tclab_object = None

        socketio.emit('tclab_status', {'connected': tclab_connected})
        time.sleep(2)

def set_heater(percentage, heater):
    global tclab_object
    try:
        if heater == 1:
            tclab_object.Q1(percentage)
        else:
            tclab_object.Q2(percentage)
        tclab_object.LED(100)
        time.sleep(0.1)
        tclab_object.LED(20)
        return True
    except:
        return False

def update_data():
    global tclab_object
    while tclab_connected:
        try:
            q1 = tclab_object.Q1()
            q2 = tclab_object.Q2()
            t1 = tclab_object.T1
            t2 = tclab_object.T2
            socketio.emit('tclab_data', {'Q1': q1, 'Q2': q2, 'T1': t1, 'T2': t2})
            time.sleep(0.8)
        except Exception as e:
            print(e)
            continue
            


@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_check_tclab_connection():
    global thread_connection
    if thread_connection is None:
        thread_connection =  threading.Thread(target=check_tclab_connection, daemon=True)
        thread_connection.start()
    socketio.emit('server_status', {'connected': " E-TCLAB-W: Connection established successfully."})

@socketio.on('set_heater')
def handle_set_heater(data):
    if set_heater(data['percentage'], data['heater']):
        socketio.emit('heater_status', {'status': f"Heater {data['heater']} set to {data['percentage']}%"})

@socketio.on('update_data')
def handle_update_data():
    global thread_update
    if thread_update is None:
        thread_update = threading.Thread(target=update_data, daemon=True)
        thread_update.start()

if __name__ == "__main__":
    socketio.run(app, host='127.0.0.1', port=5000)