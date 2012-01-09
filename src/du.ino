#include <Servo.h>

char messageBuffer[11];
int index = 0;
char cmd[3];
char pin[3];
char val[3];
char aux[4];
bool debug = false;
Servo servo;

void setup() {
  Serial.begin(115200);
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
  strncpy(aux, messageBuffer + 6, 3);
  aux[2] = '\0';
  
  if (debug) {
    Serial.println(messageBuffer);
  }
  
  if (strcmp(cmd, "00") == 0) {
      sm(pin, val);
  } else if (strcmp(cmd, "01") == 0) {
      dw(pin, val); // digital write
  } else if (strcmp(cmd, "02") == 0) {
      dr(pin, val); //  digital read
  } else if (strcmp(cmd, "98") == 0) {
      handleServo(pin, val, aux);
  } else if (strcmp(cmd, "99") == 0) {
      toggleDebug(val);
  }
}

/*
 * Toggle debug mode
 */
void toggleDebug(char *val) {
  if (strcmp(val, "00") == 0) {
    debug = false;
    Serial.println("goodbye");
  } else {
    debug = true;
    Serial.println("hello");
  }
}

/*
 * Set pin mode
 */
void sm(char *pin, char *val) {
  if (debug) Serial.println("sm");
  int p = atoi(pin);
  if (strcmp(val, "00") == 0) {
    pinMode(p, OUTPUT);
  } else {
    pinMode(p, INPUT);
  }
}

/*
 * Digital write
 */
void dw(char *pin, char *val) {
  if (debug) Serial.println("dw");
  int p = atoi(pin);
  pinMode(p, OUTPUT);
  if (strcmp(val, "00") == 0) {
    digitalWrite(p, LOW);
  } else {
    digitalWrite(p, HIGH);
  }
}

/*
 * Digital read
 */
void dr(char *pin, char *val) {
  if (debug) Serial.println("dr");
  int p = atoi(pin);
  pinMode(p, INPUT);
  int oraw = digitalRead(p);
  char m[4];
  char out[4];
  sprintf(m, "%d", p);
  sprintf(out, "%d", oraw);
  strcat(m, "::");
  strcat(m, out);
  Serial.println(m);
}

/*
 * Handle Servo commands
 * attach, detach, write, read, writeMicroseconds, attached
 */
void handleServo(char *pin, char *val, char *aux) {
  if (debug) Serial.println("ss");
  int p = atoi(pin);
  Serial.println("got signal");
  if (strcmp(val, "00") == 0) {
    servo.detach();
  } else if (strcmp(val, "01") == 0) {
    servo.attach(p);
    Serial.println("attached");
  } else if (strcmp(val, "02") == 0) {
    Serial.println("writing to servo");
    Serial.println(atoi(aux));
    servo.write(atoi(aux));
  }
}
