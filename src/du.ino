
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
    if (x != '\n' && x != '\r') messageBuffer[index++] = x;
    if (index == 6) process();
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
    Serial.println(-1);
  }
}

/*
 * Set pin mode
 */
void sm(char *pin, char *val) {
  Serial.println('0');
}

/*
 * Digital write
 */
void dw(char *pin, char *val) {
  Serial.println('1');
}

/*
 * Digital read
 */
void dr(char *pin, char *val) {
  Serial.println('2');
}

