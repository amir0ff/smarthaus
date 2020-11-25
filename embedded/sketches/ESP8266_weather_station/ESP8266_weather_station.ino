/*
   This a working example sketch for the ESP8266 microcontroller.
   It reads data from a DHT11 temperature and humidity sensor connected-
   on pin D3 and sends the data back to the RESTful API.

   Forked from Marco Schwartz [https://github.com/marcoschwartz]
   Modified and remixed by Amir Off [https://github.com/amiroff157] on Sep, 2018
*/

// Import required libraries
#include <ESP8266WiFi.h>
#include <Restfulino.h>
#include <DHT.h>

// Create restfulino instance
Restfulino rest = Restfulino();

// WiFi parameters
const char* ssid = "ssid";
const char* password = "password";

// The port to listen for incoming TCP connections
#define LISTEN_PORT 80

// Create an instance of the server
WiFiServer server(LISTEN_PORT);

// Initialize DHT sensor (pin_no, sensor type).
DHT dht(D3, DHT11);

// Variables to be exposed to the API
int temperature;
int humidity;

void setup(void)
{
  // Start Serial
  Serial.begin(115200);
  dht.begin();

  // Initialize variables and expose them to RESTful API
  rest.variable("temperature", &temperature);
  rest.variable("humidity", &humidity);

  // Give a name and an ID to the device.
  // ID should be 6 characters long (will be automatically generated if not set)
  //rest.set_id("468792");
  rest.set_name("Weather Station");

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  // Start the server
  server.begin();
  Serial.println("Server started");

  // Print the IP address in the serial monitor
  Serial.println(WiFi.localIP());
}

void loop() {

  temperature = dht.readTemperature();
  humidity = dht.readHumidity();

  // Handle RESTful API calls
  WiFiClient client = server.available();
  if (!client) {
    return;
  }
  while (!client.available()) {
    delay(1);
  }
  rest.handle(client);

}
