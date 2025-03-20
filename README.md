# Easy TCLab Website (E-TCL-W)
This project aims to improve the interaction with the **Temperature Control Lab** by making it more intuitive. Designed for students and engineers, the GUI enables real-time graph visualization (about temperature and heating power) without requiring users to write Python code manually. This makes the process faster, more accessible, and user-friendly.

## Temperature Control Lab
The Temperature Control Lab is an application of feedback control with an Arduino, an LED, two heaters, and two temperature sensors. The heater power output is adjusted to maintain a desired temperature setpoint. Thermal energy from the heater is transferred by conduction, convection, and radiation to the temperature sensor. Heat is also transferred away from the device to the surroundings.

![](https://apmonitor.com/pdc/uploads/Main/tclab_schematic.png)

More detailed information, please refer to [this documentation](https://tclab.readthedocs.io/en/latest/README.html) 

## Folder Structure

    project/
    ├── app.py                   # Main application script
    ├── requirements.txt         # Python dependencies
    ├── README.md                # Project documentation
    ├── templates/               # HTML templates
    │   └── index.html           # Main page
    ├── static/                  # Static files (JS, CSS, images)
    │   ├── logo.png             # Project logo
    │   ├── favicon.ico          # Project icon
    │   ├── script.js            # Front-end logic
    │   └── style.css            # Styling

## How it works
**E-TCL-W** is a distributed application that consists of:

-   A Flask server that handles the back-end implementation.
-   A browser-based interface that communicates with the server using WebSocket technology.

To get started, simply run the server by executing the following command in your terminal:

`python app.py` 

Once the server is running, open your browser and navigate to **`localhost:5000`** to start using the application.