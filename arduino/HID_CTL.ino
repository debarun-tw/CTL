int speakerOut = 9;
int melodyPin = 9;
String str;
volatile unsigned long tagID = 0;
volatile unsigned long lastBitArrivalTime;
volatile int bitCount = 0;

void setup()
{
  Serial.begin(9600);

  pinMode(2, INPUT);
  digitalWrite(2, HIGH);  // Enable pull-up resistor
  attachInterrupt(0, ISRzero, FALLING);

  pinMode(3, INPUT);
  digitalWrite(3, HIGH);  // Enable pull-up resistor
  attachInterrupt(1, ISRone,  FALLING);

  tagID = 0;
  bitCount = 0;

  pinMode(speakerOut, OUTPUT);

}

void loop()
{

  if(bitCount > 0 && millis() - lastBitArrivalTime >  250){

    Serial.print("$");
    Serial.print(tagID,DEC);
    Serial.print("*");
    tagID = 0;
    bitCount = 0;
  }

  if (Serial.available()){
      str = Serial.readStringUntil('*');
      char c = str[0];

      if(c == 's') {




      }
      if(c == 'f') {

         digitalWrite(speakerOut, HIGH);
         delay(100);
         digitalWrite(speakerOut, LOW);
         delay(100);

         digitalWrite(speakerOut, HIGH);
         delay(100);
         digitalWrite(speakerOut, LOW);
         delay(100);

         digitalWrite(speakerOut, HIGH);
         delay(100);
         digitalWrite(speakerOut, LOW);
         delay(100);

     }
  }
}



void ISRone(void)
{
  lastBitArrivalTime = millis();
  bitCount++;
  tagID <<= 1;
  tagID |= 1;
}

void ISRzero(void)
{
  lastBitArrivalTime = millis();
  bitCount++;
  tagID <<= 1;
}



