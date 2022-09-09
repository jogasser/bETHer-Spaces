# sensor nodes

Fundamentals of the sensor nodes: [https://github.com/sachit27/Soc-IoT](https://github.com/sachit27/Soc-IoT)



We modified the python script for our needs: [betherSpaces.py](./sensorNodes/betherSpaces.py)

- It sends the measurements to the database through HTTP requests (the link is specified in the variable baseURL).

- An additional measurement-datatype "noise" was added.

- The sensor displays the status of the last push on its display so it can be easily determined if the connection is ok. The measurements are no longer printed on the sensors display, because they aren't needed in our case.

- If the connection is interrupted and no measurements can be pushed it caches them locally and sends them after the connection is restored.


Make a cronjob to run the script periodically, e.g. every minute.

