const readline = require('readline');

class Alarm {
  constructor(time, day) {
      const [hour, minute] = time.split(':').map(Number);
      Object.assign(this, { hour, minute, day, snoozeCount: 0, active: true });
  }

  getAlarmTime() {
      const alarmTime = new Date();
      alarmTime.setHours(this.hour, this.minute, 0, 0);
      return alarmTime;
  }

  snooze() {
      if (this.snoozeCount < 3) {
          this.minute += 5;
          if (this.minute >= 60) {
              this.minute -= 60;
              this.hour += 1;
          }
          this.snoozeCount += 1;
          console.log(`Alarm snoozed until ${this.hour.toString().padStart(2, '0')}:${this.minute.toString().padStart(2, '0')}`);
      } else {
          console.log('Maximum snooze limit reached');
      }
  }

  toString() {
      return `Alarm set for ${this.hour.toString().padStart(2, '0')}:${this.minute.toString().padStart(2, '0')} on ${this.day} (Active: ${this.active})`;
  }
}

class AlarmClock {
  constructor() {
      this.alarms = [];
  }

  displayTime() {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
      console.log(`Current time: ${timeString} on ${dayOfWeek}`);
  }

  addAlarm(time, day) {
      const newAlarm = new Alarm(time, day);
      this.alarms.push(newAlarm);
      console.log(`Alarm set for ${time} on ${day}`);
  }

  deleteAlarm(index) {
      if (index >= 0 && index < this.alarms.length) {
          const deletedAlarm = this.alarms.splice(index, 1)[0];
          console.log(`Alarm ${index} deleted: ${deletedAlarm}`);
      } else {
          console.log('Invalid alarm index');
      }
  }

    checkAlarms() {
      const now = new Date();
      const nowDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const nowTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
      for (const alarm of this.alarms) {
          const alarmTime = `${alarm.hour.toString().padStart(2, '0')}:${alarm.minute.toString().padStart(2, '0')}`;
          if (alarm.day === nowDay && nowTime === alarmTime && alarm.active) {
              console.log(`Alarm ringing: ${alarm}`);
              this.promptUserForAlarmAction(alarm);
          }
      }
  }
  
    promptUserForAlarmAction(alarm) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter "snooze" to snooze, "off" to turn off: ', (answer) => {
            if (answer.trim().toLowerCase() === 'snooze') {
                alarm.snooze();
            } else if (answer.trim().toLowerCase() === 'off') {
                alarm.active = false;
                console.log('Alarm turned off');
            }
            rl.close();
        });
    }

    listAlarms() {
        if (this.alarms.length === 0) {
            console.log('No alarms set');
        } else {
            this.alarms.forEach((alarm, index) => {
                console.log(`${index}: ${alarm}`);
            });
        }
    }
}

const alarmClock = new AlarmClock();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log('\nAlarm Clock Menu');
    console.log('1. Display current time');
    console.log('2. Add an alarm');
    console.log('3. Delete an alarm');
    console.log('4. List alarms');
    console.log('5. Exit');
}


function handleMenuChoice(choice) {
  const trimmedChoice = choice.trim();
  switch (trimmedChoice) {
      case '1':
          alarmClock.displayTime();
          break;
      case '2':
          rl.question('Enter time (HH:MM): ', (time) => {
              rl.question('Enter day of the week: ', (day) => {
                  alarmClock.addAlarm(time, day);
                  showMenu();
                  rl.prompt();
              });
          });
          return;
      case '3':
          // List alarms first
          alarmClock.listAlarms();
          rl.question('Enter alarm index to delete: ', (index) => {
              const alarmToDelete = alarmClock.alarms[parseInt(index, 10)];
              if (alarmToDelete) {
                  alarmClock.promptUserForAlarmAction(alarmToDelete);
              } else {
                  console.log('Invalid alarm index');
              }
              showMenu();
              rl.prompt();
          });
          return;
      case '4':
          alarmClock.listAlarms();
          break;
      case '5':
          rl.close();
          return;
      default:
          console.log('Invalid choice');
  }

  showMenu();
  rl.prompt();
}

rl.on('line', handleMenuChoice);

showMenu();
rl.prompt();

setInterval(() => {
    alarmClock.checkAlarms();
}, 60000);


