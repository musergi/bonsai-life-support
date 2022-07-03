#include <SPI.h>
#include <SD.h>

#define HUMIDITY_SENSOR_ID 1
#define HUMIDITY_SAMPLING_INTERVAL 3000
#define HUMIDITY_SENSOR_PIN A0

#define SD_CHIP_SELECT 4

template<typename T, int N>
class Queue
{
  private:
    int readPtr;
    int writePtr;
    T data[N];
  public:
    Queue() : readPtr(0), writePtr(0) {}

    bool empty() { return count() == 0; }
    bool full() { return count() == N - 1; }
    int count() { return (writePtr - readPtr + N) % N; }

    T pop()
    {
      T val = data[readPtr];
      readPtr = (readPtr + 1) % N;
      return val;
    }
    
    void push(T e)
    {
      data[writePtr] = e;
      writePtr = (writePtr + 1) % N;
    }
};

typedef void (*Task)(void);

class RepeatingTask
{
  private:
    long lastCall = 0;
    long period;
    Task func;
  public:
    RepeatingTask(long period, Task func) : period(period), func(func) {}

    bool canExecute()
    {
      return millis() - lastCall > period;
    }
    
    void exec()
    {
      func();
      lastCall = millis();
    }
};

class SensorData
{
  private:
    long timestamp;
    int sensorValue;
    byte sensorId;
  public:
    SensorData() : timestamp(0), sensorValue(0), sensorId(0)
    {
    }
  
    SensorData(int sensorValue, byte sensorId) : timestamp(millis()), sensorValue(sensorValue), sensorId(sensorId)
    {
    }

    SensorData& operator=(const SensorData& other)
    {
      timestamp = other.timestamp;
      sensorValue = other.sensorValue;
      sensorId = other.sensorId;
    }

    String serialize()
    {
      String s = "";
      s += String(timestamp);
      s += ",";
      s += String(sensorId);
      s += ",";
      s += String(sensorValue);
      return s;
    }
};


Queue<SensorData, 50> dataBuffer;

void readSensor()
{
  if (!dataBuffer.full())
  {
    SensorData data(analogRead(HUMIDITY_SENSOR_PIN), HUMIDITY_SENSOR_ID);
    dataBuffer.push(data);
  }
}

void logBuffer()
{
  Serial.print("Buffer occupation: ");
  Serial.println(dataBuffer.count());
}

void writeData()
{
  bool success = SD.begin(SD_CHIP_SELECT);
  if (success)
  {
    String filename = String(millis()) + ".csv";
    File dataFile = SD.open(filename, FILE_WRITE);
    if (dataFile)
    {
      Serial.print("Opened file: ");
      Serial.println(filename);
      while (!dataBuffer.empty())
      {
        String serializedData = dataBuffer.pop().serialize();
        Serial.print("Writing: ");
        Serial.println(serializedData);
        dataFile.write(serializedData.c_str());
        dataFile.write("\n");
      }
      dataFile.close();
    }
    SD.end();
  }
}

RepeatingTask tasks[] = {
  RepeatingTask(3000, readSensor),
  RepeatingTask(6000, logBuffer),
  RepeatingTask(24000, writeData)
};

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  for (int i = 0; i < sizeof(tasks) / sizeof(RepeatingTask); i++)
  {
    if (tasks[i].canExecute())
      tasks[i].exec();
  }
}
