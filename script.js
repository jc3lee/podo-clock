const timerLabel = document.getElementById("timer-label")
const timerLeft = document.getElementById("timer-left")
const startStop = document.getElementById("start_stop")
const reset = document.getElementById("reset")
const breakLength = document.getElementById("break-length")
const sessionLength = document.getElementById("session-length")
const breakDecrement = document.getElementById("break-decrement")
const breakIncrement = document.getElementById("break-increment")
const sessionDecrement = document.getElementById("session-decrement")
const sessionIncrement = document.getElementById("session-increment")
const beep = document.getElementById("beep")

document.addEventListener('contextmenu', e => {
  e.preventDefault()
}, false)

let interval = null
let breakTimer = 5, sessionTimer = 25, hasStarted = false,
  isSession = true, timeLeft = 0, mouseDownCounter = 0, btnName = ""

const initAll = () => {
  if (interval) clearInterval(interval)
  interval = null
  breakTimer = 5
  sessionTimer = 25
  hasStarted = false
  isSession = true
  timeLeft = 0
  mouseDownCounter = 0
  btnName = ""
  timerLabel.innerText = "🖥️"
  timerLeft.innerText = getTimerString(sessionTimer * 60)
  breakLength.innerText = breakTimer
  sessionLength.innerText = sessionTimer
  //reset beep
  resetBeep()
}

const updateBreakTimer = (value) => {
  //prevent changing timer while running
  if (hasStarted) return
  if (breakTimer + value <= 0 || breakTimer + value > 60) return
  breakTimer += value
  breakLength.innerText = breakTimer
  if (!isSession) timerLeft.innerText = getTimerString(breakTimer * 60)
}

const updateSessionTimer = (value) => {
  //prevent changing timer while running
  if (hasStarted) return
  if (sessionTimer + value <= 0 || sessionTimer + value > 60) return
  sessionTimer += value
  sessionLength.innerText = sessionTimer
  if (isSession) timerLeft.innerText = getTimerString(sessionTimer * 60)
}

const updateBigTimer = () => {
  if (timeLeft === 0) {
    //change session if not already initialized
    if (timerLeft.innerText === "00:00") {
      isSession = !isSession
      playBeep()
    }
    timerLabel.innerText = isSession ? "🖥️" : "🍹"
    timeLeft = (isSession ? sessionTimer : breakTimer) * 60
  }
  timeLeft--
  if (timeLeft < 60 && !timerLeft.classList.contains("active")) {
    timerLeft.classList.add("active")
  } else {
    if (timeLeft >= 60 && timerLeft.classList.contains("active")) timerLeft.classList.remove("active")
  }
  const timerString = getTimerString(timeLeft)
  timerLeft.innerText = timerString
}

const getTimerString = (timeLeft) => {
  const min = Math.trunc(timeLeft / 60)
  const sec = timeLeft % 60
  const minString = min >= 10 ? "" + min : "0" + min
  const secString = sec >= 10 ? "" + sec : "0" + sec
  return minString + ":" + secString
}

const updateStartStop = () => {
  hasStarted = !hasStarted
  if (hasStarted) {
    //run timer
    interval = setInterval(updateBigTimer, 50)
  } else {
    //pause timer
    clearInterval(interval)
  }
}

const playBeep = () => {
  beep.play()
  setTimeout(resetBeep, 1300)
}

const resetBeep = () => {
  beep.pause()
  beep.currentTime = 0
}

//add hold down event
let mouseDownInterval = null

const handleMouseDown = btnName => {
  mouseDownInterval = setInterval(() => {
    mouseDownCounter++
    if (mouseDownCounter >= 10) {
      switch (btnName) {
        case "breakDec":
          updateBreakTimer(-1)
          break;
        case "breakInc":
          updateBreakTimer(1)
          break;
        case "sessionDec":
          updateSessionTimer(-1)
          break;
        case "sessionInc":
          updateSessionTimer(1)
          break;
        default:
          console.log("btn name error")
      }
    }
  }, 50)
}

const handleMouseUp = () => {
  mouseDownCounter = 0
  if (mouseDownInterval) clearInterval(mouseDownInterval)
}

breakDecrement.addEventListener("click", () => updateBreakTimer(-1))
breakIncrement.addEventListener("click", () => updateBreakTimer(1))
sessionDecrement.addEventListener("click", () => updateSessionTimer(-1))
sessionIncrement.addEventListener("click", () => updateSessionTimer(1))
startStop.addEventListener("click", updateStartStop)
reset.addEventListener("click", initAll)

//change on mouse hold down
breakDecrement.addEventListener("mousedown", () => handleMouseDown("breakDec"))
breakDecrement.addEventListener("mouseup", handleMouseUp)
breakIncrement.addEventListener("mousedown", () => handleMouseDown("breakInc"))
breakIncrement.addEventListener("mouseup", handleMouseUp)
sessionDecrement.addEventListener("mousedown", () => handleMouseDown("sessionDec"))
sessionDecrement.addEventListener("mouseup", handleMouseUp)
sessionIncrement.addEventListener("mousedown", () => handleMouseDown("sessionInc"))
sessionIncrement.addEventListener("mouseup", handleMouseUp)
//gesture hold down
breakDecrement.addEventListener("touchstart", () => handleMouseDown("breakDec"))
breakDecrement.addEventListener("touchend", handleMouseUp)
breakIncrement.addEventListener("touchstart", () => handleMouseDown("breakInc"))
breakIncrement.addEventListener("touchend", handleMouseUp)
sessionDecrement.addEventListener("touchstart", () => handleMouseDown("sessionDec"))
sessionDecrement.addEventListener("touchend", handleMouseUp)
sessionIncrement.addEventListener("touchstart", () => handleMouseDown("sessionInc"))
sessionIncrement.addEventListener("touchend", handleMouseUp)

initAll()