
char messageBuffer[6];
int index = 0;
char cmd[3];
char pin[3];
char val[3];

void setup() {
  Serial.begin(9600);
}

void loop() {
  while(Serial.available() > 0) {
    char x = Serial.read();
    if (x == '!') index = 0;      // start
    else if (x == '.') process(); // end
    else messageBuffer[index++] = x;
  }
}

/*
 * Deal with a full message and determine function to call
 */
void process() {
  index = 0;
  
  strncpy(cmd, messageBuffer, 2);
  cmd[2] = '\0';
  strncpy(pin, messageBuffer + 2, 2);
  pin[2] = '\0';
  strncpy(val, messageBuffer + 4, 2);
  val[2] = '\0';
  
  if (strcmp(cmd, "00") == 0) {
      sm(pin, val);
  } else if (strcmp(cmd, "01") == 0) {
      dw(pin, val);
  } else if (strcmp(cmd, "02") == 0) {
      dr(pin, val);
  } else {
    Serial.println(messageBuffer);
  }
}

/*
 * Set pin mode
 */
void sm(char *pin, char *val) {
  int p = atoi(pin);
  if (strcmp(val, "00") == 0) pinMode(p, OUTPUT);
  else pinMode(p, INPUT);
}

/*
 * Digital write
 */
void dw(char *pin, char *val) {
  int p = atoi(pin);
  if (strcmp(val, "00") == 0) digitalWrite(p, LOW);
  else digitalWrite(p, HIGH);
}

/*
 * Digital read
 */
void dr(char *pin, char *val) {}

