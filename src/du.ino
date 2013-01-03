#include <Servo.h>
#include <LiquidCrystal.h>


bool debug = false;

int index = 0;

char messageBuffer[12];
char cmd[3];
char pin[3];
char val[4];
char aux[4];

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

  if (atoi(cmd) > 90) {
    strncpy(val, messageBuffer + 4, 2);
    val[2] = '\0';
    strncpy(aux, messageBuffer + 6, 3);
    aux[3] = '\0';
  } else {
    strncpy(val, messageBuffer + 4, 3);
    val[3] = '\0';
    strncpy(aux, messageBuffer + 7, 3);
    aux[3] = '\0';
  }

  if (debug) {
    Serial.println(messageBuffer);
  }
  int cmdid = atoi(cmd);

  // Serial.println(cmd);
  // Serial.println(pin);
  // Serial.println(val);
  // Serial.println(aux);

  switch(cmdid) {
    case 0:  sm(pin,val);              break;
    case 1:  dw(pin,val);              break;
    case 2:  dr(pin,val);              break;
    case 3:  aw(pin,val);              break;
    case 4:  ar(pin,val);              break;
    case 89: handleLCD(messageBuffer); break;
    case 97: handlePing(pin,val,aux);  break;
    case 98: handleServo(pin,val,aux); break;
    case 99: toggleDebug(val);         break;
    default:                           break;
  }
}

/*
 * Toggle debug mode
 */
void toggleDebug(char *val) {
  if (atoi(val) == 0) {
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
  int p = getPin(pin);
  if(p == -1) { if(debug) Serial.println("badpin"); return; }
  if (atoi(val) == 0) {
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
  int p = getPin(pin);
  if(p == -1) { if(debug) Serial.println("badpin"); return; }
  pinMode(p, OUTPUT);
  if (atoi(val) == 0) {
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
  int p = getPin(pin);
  if(p == -1) { if(debug) Serial.println("badpin"); return; }
  pinMode(p, INPUT);
  int oraw = digitalRead(p);
  char m[7];
  sprintf(m, "%02d::%02d", p,oraw);
  Serial.println(m);
}

/*
 * Analog read
 */
void ar(char *pin, char *val) {
  if(debug) Serial.println("ar");
  int p = getPin(pin);
  if(p == -1) { if(debug) Serial.println("badpin"); return; }
  pinMode(p, INPUT); // don't want to sw
  int rval = analogRead(p);
  char m[8];
  sprintf(m, "%s::%03d", pin, rval);
  Serial.println(m);
}

void aw(char *pin, char *val) {
  if(debug) Serial.println("aw");
  int p = getPin(pin);
  pinMode(p, OUTPUT);
  if(p == -1) { if(debug) Serial.println("badpin"); return; }
  analogWrite(p,atoi(val));
}

int getPin(char *pin) { //Converts to A0-A5, and returns -1 on error
  int ret = -1;
  if(pin[0] == 'A' || pin[0] == 'a') {
    switch(pin[1]) {
      case '0':  ret = A0; break;
      case '1':  ret = A1; break;
      case '2':  ret = A2; break;
      case '3':  ret = A3; break;
      case '4':  ret = A4; break;
      case '5':  ret = A5; break;
      default:             break;
    }
  } else {
    ret = atoi(pin);
    if(ret == 0 && (pin[0] != '0' || pin[1] != '0')) {
      ret = -1;
    }
  }
  return ret;
}

/*
 * Handle LiquidCrystal commands
 *
 */
void handleLCD(char *messageBuffer) {
  static LiquidCrystal *lcd = NULL;
  
  uint8_t *msg = (uint8_t *)messageBuffer;
  uint8_t cmd = msg[0];
  if (cmd && !lcd) { if(debug) Serial.println("notready"); return; }
  
  // 0 init
  if (cmd == 0) {
    int p00, p01, p02, p03, p04, p05, p06, p07, p08, p09, p10, p11;
    p00 = msg[1] >> 4;
    if (!p00) lcd = new LiquidCrystal(12, 11, 5, 4, 3, 2);
    else {
      p01 = msg[1] & 0xF;
      p02 = msg[2] >> 4;
      p03 = msg[2] & 0xF;
      p04 = msg[3] >> 4;
      p05 = msg[3] & 0xF;
      p06 = msg[4] >> 4;
      if (!p06) lcd = new LiquidCrystal(p00, p01, p02, p03, p04, p05);
      else {
        p07 = msg[4] & 0xF;
        if (!p07) lcd = new LiquidCrystal(p00, p01, p02, p03, p04, p05, p06);
        else {
          p08 = msg[5] >> 4;
          p09 = msg[5] & 0xF;
          p10 = msg[6] >> 4;
          //p11 = msg[6] & 0xF;      // extra
          if (!p10) lcd = new LiquidCrystal(p00, p01, p02, p03, p04, p05, p06, p07, p08, p09);
          else lcd = new LiquidCrystal(p00, p01, p02, p03, p04, p05, p06, p07, p08, p09, p10);
        }
      }
    }
    
  // 1 begin
  } else if (cmd == 1) {
    lcd->begin(msg[1], msg[2]);
  
  // 2 clear
  } else if (cmd == 2) {
    lcd->clear();
  
  // 3 home
  } else if (cmd == 3) {
    lcd->home();
    
  // 4 setCursor
  } else if (cmd == 4) {
    lcd->setCursor(atoi(val), atoi(aux));
  
  // 5 write
  } else if (cmd == 5) {
    char writeBuffer[7];
    strncpy(writeBuffer, val, 3);
    strncpy(writeBuffer, aux, 3);
    writeBuffer[6] = '\0';
    lcd->write(writeBuffer);
    
  // 6 cursor on/off
  } else if (cmd == 6) {
    if (val[1] == 'n') lcd->cursor();
    else lcd->noCursor();
  
  // 7 blink on/off
  } else if (cmd == 7) {
    if (val[1] == 'n') lcd->blink();
    else lcd->noBlink();
  
  // 8 display on/off
  } else if (cmd == 8) {
    if (val[1] == 'n') lcd->display();
    else lcd->noDisplay();
  
  // 9 scroll left/right, autoscroll on/off
  } else if (cmd == 9) {
    if (val[0] == 'l') lcd->scrollDisplayLeft();
    else if (val[0] == 'r') lcd->scrollDisplayRight();
    else if (val[1] == 'n') lcd->autoscroll();
    else lcd->noAutoscroll();
  
  // A text and autoscroll ltr/rtl
  } else if (cmd == 'A') {
    if (val[0] == 'r') lcd->rightToLeft();
    else lcd->leftToRight();
  
  // B createChar 
  } else if (cmd == 'B') {
    lcd->createChar(msg[1], msg+2);      // TDB: need 8 byte aux!
  }
}

/*
 * Handle Ping commands
 * fire, read
 */
void handlePing(char *pin, char *val, char *aux) {
  if (debug) Serial.println("ss");
  int p = getPin(pin);

  if(p == -1) { if(debug) Serial.println("badpin"); return; }
  Serial.println("got signal");

  // 01(1) Fire and Read
  if (atoi(val) == 1) {
    char m[16];

    pinMode(p, OUTPUT);
    digitalWrite(p, LOW);
    delayMicroseconds(2);
    digitalWrite(p, HIGH);
    delayMicroseconds(5);
    digitalWrite(p, LOW);

    Serial.println("ping fired");

    pinMode(p, INPUT);
    sprintf(m, "%s::read::%08d", pin, pulseIn(p, HIGH));
    Serial.println(m);

    delay(50);
  }
}

/*
 * Handle Servo commands
 * attach, detach, write, read, writeMicroseconds, attached
 */
void handleServo(char *pin, char *val, char *aux) {
  if (debug) Serial.println("ss");
  int p = getPin(pin);
  if(p == -1) { if(debug) Serial.println("badpin"); return; }
  Serial.println("signal: servo");

  // 00(0) Detach
  if (atoi(val) == 0) {
    servo.detach();
    char m[12];
    sprintf(m, "%s::detached", pin);
    Serial.println(m);

  // 01(1) Attach
  } else if (atoi(val) == 1) {
    // servo.attach(p, 750, 2250);
    servo.attach(p);
    char m[12];
    sprintf(m, "%s::attached", pin);
    Serial.println(m);

  // 02(2) Write
  } else if (atoi(val) == 2) {
    Serial.println("writing to servo");
    Serial.println(atoi(aux));
    // Write to servo
    servo.write(atoi(aux));
    delay(15);

    // TODO: Experiment with microsecond pulses
    // digitalWrite(pin, HIGH);   // start the pulse
    // delayMicroseconds(pulseWidth);  // pulse width
    // digitalWrite(pin, LOW);    // stop the pulse

  // 03(3) Read
  } else if (atoi(val) == 3) {
    Serial.println("reading servo");
    int sval = servo.read();
    char m[13];
    sprintf(m, "%s::read::%03d", pin, sval);
    Serial.println(m);
  }
}
