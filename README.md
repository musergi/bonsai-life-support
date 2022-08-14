# Bonsai Life Support

This is a simple system that allows you to monitor your bonsai's vitals. Right
now it is preatty basic it only shows the humidity level.

## Project structure

The project is structured into three components, the 'probe' component is the
software running in the device with the sensor. This device then sends data to
the 'server' component, a REST API. Finally, the 'gui' component shows the
data to the user.

## Hardware

- [ESP32 Dev Kit C](https://www.amazon.es/AZDelivery-NodeMCU-ESP-WROOM-32-Tablero-Desarrollo/dp/B071P98VTG/ref=mp_s_a_1_1_sspa?crid=2L9AKGQQV2GX0&keywords=esp32&qid=1660501854&refinements=p_76%3A831314031&rnid=831276031&rps=1&sprefix=esp32%2Caps%2C120&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyRjhLVVpBVFRSRUg5JmVuY3J5cHRlZElkPUEwMTQyOTc5M0M3QVk2REhMNzFWOSZlbmNyeXB0ZWRBZElkPUEwNTEwNTEwVTMzS0FRQlRaNjZYJndpZGdldE5hbWU9c3BfcGhvbmVfc2VhcmNoX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=)
