#include <VirtualWire.h>

bool debug = false;

int index = 0;

char messageBuffer[36];
char cmd[3];
char pin[3];
char val[4];
char aux[4];
char msg[27]; // 26 max characters + 1 for null byte

boolean rxStarted = false;

void setup() {
  Serial.begin(9600);
  vw_set_ptt_inverted(true); // Required for DR3100
  vw_setup(2000);  // Bits per sec
}

void loop() {
  while(Serial.available() > 0) {
    char x = Serial.read();
    if (x == '!') {
      memset(&messageBuffer[0], 0, sizeof(messageBuffer)); 
      index = 0;      // start
    } else if (x == '.') process(); // end
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
  
  if (atoi(cmd) == 6) {
    strncpy(msg, messageBuffer + 4, 26);
    msg[26] = '\0';
  } else if (atoi(cmd) > 90) {
    strncpy(val, messageBuffer + 4, 2);
    val[2] = '\0';
    strncpy(aux, messageBuffer + 6, 3);
    aux[3] = '\0';
  } else {
    strncpy(val, messageBuffer + 4, 3);
    val[4] = '\0';
    strncpy(aux, messageBuffer + 7, 3);
    aux[4] = '\0';
  }

  if (debug) {
    Serial.println(messageBuffer);
  }
  int cmdid = atoi(cmd);

  if (cmdid == 4) {
   
    pinMode(8, OUTPUT);
    digitalWrite(8, HIGH);  
 
  }
//  Serial.println(cmd);
//  Serial.println(pin);
//  Serial.println(val);
//  Serial.println(aux);
//  Serial.println(msg);

  switch(cmdid) {
    case 0:  sm(pin,val);              break;
    case 1:  dw(pin,val);              break;
    case 2:  dr(pin,val);              break;
    case 3:  aw(pin,val);              break;
    case 4:  ar(pin,val);              break;
    case 5:  rfr(pin,val);             break;
    case 6:  rft(pin,msg);         break;
    case 97: handlePing(pin,val,aux);  break;
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


/*
 * Digital RF read
 */
void rfr(char *pin, char *val) {
  
  if (debug) Serial.println("rfr");
  int p = getPin(pin);
  if(p == -1) { if(debug) Serial.println("badpin"); return; }

  if(!rxStarted){
    vw_set_rx_pin(p);
    vw_rx_start();       // Start the receiver PLL running
    rxStarted = true;
  }
  
  uint8_t buf[VW_MAX_MESSAGE_LEN];
  uint8_t buflen = VW_MAX_MESSAGE_LEN;

  if (vw_get_message(buf, &buflen)) // Non-blocking
  {
    int i;
    
    Serial.println("Got");
    Serial.println((char*)buf);

    char m[VW_MAX_MESSAGE_LEN];
    sprintf(m, "%02d::%s", p, (char*)buf);
    Serial.println(m);
  }
}

/*
 * Digital RF transmit
 */
void rft(char *pin, char *msg) {  
  if (debug) Serial.println("rft");
  int p = getPin(pin);
  if(p == -1) { if(debug) Serial.println("badpin"); return; }
  
  vw_set_tx_pin(p);
  vw_send((uint8_t *)msg, strlen(msg) + 1); // +1 to include null byte
  vw_wait_tx(); // Wait until the whole message is gone
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
