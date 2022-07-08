#include <SPI.h>
#include <SD.h>
#include <LiquidCrystal.h>

#define LCD_RS 10
#define LCD_EN 9
#define LCD_D4 8
#define LCD_D5 7
#define LCD_D6 6
#define LCD_D7 5

#define HUMIDITY_SENSOR_ID 1
#define HUMIDITY_SAMPLING_INTERVAL 3000
#define HUMIDITY_SENSOR_PIN A0

#define SD_CHIP_SELECT 4

#define BUFFER_CAPACITY 75

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

LiquidCrystal lcd(LCD_RS, LCD_EN, LCD_D4, LCD_D5, LCD_D6, LCD_D7);
Queue<SensorData, BUFFER_CAPACITY> dataBuffer;

void readSensor()
{
  if (!dataBuffer.full())
  {
    int sensorValue = analogRead(HUMIDITY_SENSOR_PIN);
    SensorData data(sensorValue, HUMIDITY_SENSOR_ID);
    dataBuffer.push(data);
    int humidity = map(sensorValue, 0, 1024, 100, 0);
    lcd.clear();
    lcd.print("H:");
    lcd.print(humidity);
    lcd.print("%");
    lcd.setCursor(7, 0);
    lcd.print("SV:");
    lcd.print(sensorValue);
    lcd.setCursor(0, 1);
    lcd.print("B:");
    lcd.print(dataBuffer.count());
    lcd.setCursor(7, 1);
    lcd.print("FT:");
    lcd.print((BUFFER_CAPACITY - dataBuffer.count() - 1) * HUMIDITY_SAMPLING_INTERVAL / 1000);
    lcd.print("s");
  }
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
  RepeatingTask(HUMIDITY_SAMPLING_INTERVAL, readSensor),
  RepeatingTask(30000, writeData)
};

void setup()
{
  lcd.begin(16, 2);
}

void loop()
{
  for (int i = 0; i < sizeof(tasks) / sizeof(RepeatingTask); i++)
  {
    if (tasks[i].canExecute())
      tasks[i].exec();
  }
}
