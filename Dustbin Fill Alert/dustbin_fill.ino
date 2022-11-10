
#define echoPin 2 // attach pin D2 Arduino to pin Echo 
#define trigPin 3 //attach pin D3 Arduino to pin Trig 


long duration; // duration of sound wave travel in microseconds
int distance;  // distance measurement
float percentage; // calculating the Dustbins waste level

void setup() {

  pinMode(trigPin, OUTPUT); // Sets the trigPin as an OUTPUT
  pinMode(echoPin, INPUT);  // Sets the echoPin as an INPUT
  Serial.begin(9600);
  Serial.println("Identification of Wastage level");
  Serial.println("with Arduino UNO R3");

}

void loop() {

  // Clears the trigPin condition
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  duration = pulseIn(echoPin, HIGH);

  distance = duration * 0.034 / 2;

  percentage = distance/100;

  if (distance > 100){

  }

  else { 
      
    if (distance > 75 ){
      Serial.print("Dustbin is empty");
      Serial.println(" ");
      Serial.print(100-distance);
      Serial.print("% is filled");
      Serial.println(" ");
    }

    else{

      if(distance >= 15 ){
          Serial.print("Dustbin is About to fill");
          Serial.println(" ");
          Serial.print(100 - distance);
          Serial.print("% is filled");
          Serial.println(" ");
      }

      if(distance <= 10 ){
          Serial.print("Dustbin is full: Please collect the waste from Dustbin at SNO: 13 ");
          Serial.println(" ");
          Serial.print(100 - distance);
          Serial.print("% is filled");
          Serial.println(" ");
      }



    }

  }

  
  delay(5000);

}