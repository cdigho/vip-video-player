/*
 * @Author: Jiang Menghao
 * @Date: 2022-01-22 20:34:17
 * @LastEditTime: 2022-06-05 19:48:16
 * @LastEditors: Jiang Menghao
 * @FilePath: /vip-private/script.js
 */
let form = document.querySelector('form')
let returnBtn = document.querySelector('.card-back .return')
let timerBtn = document.querySelector('.card-back .timer')
let timer
let setTimer = document.querySelector('.set-timer')
let timer30 = document.querySelector('.set-timer-30')
let timer60 = document.querySelector('.set-timer-60')
let timer90 = document.querySelector('.set-timer-90')
let cancelBtn = document.querySelector('.cancel-btn')
let delay
let promotion = document.querySelector('.promotion')
let promotionList = []

function collectVideoLink (videoLink) {
  fetch('https://vip-api.heimaokeji.xyz/api/video/submitVideoLink', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      videoLink
    })
  })
}

async function getPromotionInfo () {
  const response = await fetch('https://vip-api.heimaokeji.xyz/api/promotion/getPromotion', {
    method: 'GET'
  }).then(res => res.json())
  if (response.promotionList && response.promotionList.length > 0) {
    promotionList = response.promotionList
    promotion.classList.add('show')
    document.querySelector('.promotion-poster>span').innerHTML = promotionList[0].discount
    document.querySelector('.promotion-poster>img').src = promotionList[0].image
    document.querySelector('.promotion-body .title>h3').innerHTML = promotionList[0].title
    document.querySelector('.promotion-body>span').innerHTML = promotionList[0].subtitle
    document.querySelector('.promotion-footer>span').innerHTML = promotionList[0].date
    document.querySelector('.promotion-footer>a').href = promotionList[0].link
    document.querySelector('#promotion-qr h3').innerHTML = '手机' + promotionList[0].app + '扫一扫'
    
    const canvas = document.querySelector('.qrcode')
    QRCode.toCanvas(canvas, promotionList[0].link, function (error) {
      if (error) console.error(error)
    })
  }
}

getPromotionInfo()

async function getRedPocketInfo () {
  const response = await fetch('https://vip-api.heimaokeji.xyz/api/redPocket/getRedPocket', {
    method: 'GET'
  }).then(res => res.json())
  if (response.redPocket && response.redPocket.length > 0) {
    // 一个红包都没开启，则直接隐藏本区域
    if (response.redPocket.every((item) => !item.visible)) {
      const redPocketEl = document.querySelector('.red-pockets')
      redPocketEl.classList.add('hidden')
    }
    // 至少有一个红包开启
    else {
      const buttons = document.querySelectorAll('.red-pockets>a')
      response.redPocket.forEach((item, index) => {
        if (item.visible) {
          buttons[index].href = item.link
        } else {
          buttons[index].classList.add('hidden')
        }
      })
    }
  }
}

getRedPocketInfo()

window.onresize = function () {
  document.body.style.minHeight = window.innerHeight + 'px'
}
window.onresize()

form.addEventListener('submit', (e) => {
  e.preventDefault()
  let mediaInput = document.querySelector('#media-url')
  let mediaURL = mediaInput.value
  let api = "https://jx.xmflv.com/?url="
  let card = document.querySelector('.card')
  let player = document.querySelector('.player')

  // collect video link typed by user
  collectVideoLink(mediaURL)

  mediaInput.blur()
  card.classList.add('turn-to-back')
  promotion.classList.remove('show')
  delay = window.setTimeout(function () {
    player.src = api + mediaURL
  }, 800)

  returnBtn.addEventListener('click', (e) => {
    player.src = ''
    card.classList.remove('turn-to-back')
    mediaInput.value = ''
    window.clearTimeout(delay)
    if (promotionList.length > 0) {
      promotion.classList.add('show')
    }
  })
})

timerBtn.addEventListener('click', function () {
  console.log('clicked')
  setTimer.classList.toggle('show-set-timer')
})

timer30.addEventListener('click', (e) => {
  setTimer.classList.remove('show-set-timer')
  timer = window.setTimeout(function turnToFront() {
    returnBtn.click()
  }, 1800000)
})

timer60.addEventListener('click', (e) => {
  setTimer.classList.remove('show-set-timer')
  timer = window.setTimeout(function turnToFront() {
    returnBtn.click()
  }, 3600000)
})

timer90.addEventListener('click', (e) => {
  setTimer.classList.remove('show-set-timer')
  timer = window.setTimeout(function turnToFront() {
    returnBtn.click()
  }, 5400000)
})

cancelBtn.addEventListener('click', (e) => {
  setTimer.classList.remove('show-set-timer')
  if(timer) {
    window.clearTimeout(timer)
  }
})