# Bonsai Life Support

This is a simple system that allows you to monitor your bonsai's vitals. Right
now it is preatty basic it only shows the humidity level.

## Project structure

The project is structured into three components, the 'probe' component is the
software running in the device with the sensor. This device then sends data to
the 'server' component, a REST API. Finally, the 'gui' component shows the
data to the user.
